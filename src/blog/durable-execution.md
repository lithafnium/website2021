---
title: What's the Deal With Durable Execution?
date: 2026-06-30
description: An overview of durable workflows, DBOS internals, and how I built my own toy version.
---

A few weeks ago, I came across a fascinating interview with database pioneer Michael Stonebraker, creator of Postgres. In that interview, he described his shared vision with Matei Zaharia for an operating system backed by a database, which eventually became the foundation for DBOS, their developer friendly product born from their research.

Having used Temporal extensively at work, the concept of a durable execution system being powered by a single Postgres instance was immediately appealing. I've heard of DBOS before as a Temporal alternative, but I've never taken time to really explore its internals in depth. Looking into DBOS's implementation inspired me to build my own minimal durable execution library. More on that later.

Durability has become a central concern in agentic development. Agent tasks are ephemeral, and should be - an agent should have the capability to spin up thousands of subtasks in parallel and let them complete, retry, or fail. However, the state they produce and depend on is often not ephemeral. The agent's plan, its context, approvals, retries, and execution history need to outlive any single worker process.

This makes having a disk-backed solution that stores the state of the agent, as well as the individual steps of its execution, incredibly desirable. We've seen this in the growing popularity of Cloudflare's Durable Objects, which address the former, and tools like Temporal and DBOS, which address the latter. 

Before diving in to DBOS, however, it would be good to provide a quick overview of durable workflows and the theory behind them. 

Durable execution takes a function and records its completion and result in an external store, making its execution reliable by allowing subsequent runs to fetch and replay those results instead of repeating work. Typically these functions are side effects, such as an api call, a database write, communicating with another service, etc., work that can fail but can be retried within a broader context. 

In practice, an example could look like the following routine:

```go
func ProcessWorkOrder(orderID, customerID string) error {
	order, err := getOrder(orderID)
	if err != nil {
		return fmt.Errorf("get order %s: %w", orderID, err)
	}
	
	// external service
	if err := populateOrder(order); err != nil {
		return fmt.Errorf("populate order %s: %w", orderID, err)
	}

	// external service
	if err := chargeCustomer(customerID); err != nil {
		return fmt.Errorf("charge customer %s for order %s: %w", customerID, orderID, err)
	}

	return nil
}
```

Each of the functions, `getOrder`, `populateOrder`, and `chargeCustomer` are individual steps whose outputs would be recorded in some external store upon completion. 

In the case of failure, say, if `populateOrder` returns an error for example, we run `ProcessWorkOrder` again from the top. The second time this workflow is run we don't need to execute the database read again. We get the output of the previous run's `getOrder` call from our external store and skip that first step. 

While simple, the implications are enormous.

Workflows can be suspended anytime they execute another **remote function**, remote being any work executed asynchronously in another child workflow or step. Function suspension avoids the need to rerun the workflow for long periods of time, only needing to resume once its children workflows and steps have finished running, consuming zero resources while waiting.

This means that failures and retries are contained within its execution context - a single step can be retried hundreds of times without restarting the workflow from scratch. Parts of the workflow can also remain suspended indefinitely until an external signal allows resumption. This paradigm plays nicely with "human-in-the-loop" workflows, in which an agent may have to wait for hours at a time before receiving a human response. Workflow suspension allows for resources to be freed up while allowing the workflow to be resumed in the future. 

### Determinism

Durable execution frameworks will state that workflows must be deterministic, while smaller units of work (DBOS steps or Temporal activities) don't have to be.

The main reason that determinism in workflows is required is because durable execution re-executes workflow code during recovery. If the control flow for a workflow goes down a different branch of execution in a subsequent run, you run the risk of encountering catastrophic bugs that can be difficult to fix. 

For example,

```go
func OrderWorkflow(orderID string) error {
	if time.Now().Hour() < 12 {
		err := ChargeCustomer(orderID)
		if err != nil {
			return err
		}
	} else {
		err := SendDiscountEmail(orderID)
		if err != nil {
			return err
		}
	}

	return nil
}
```

Imagine `OrderWorkflow` is a durable workflow, and `ChargeCustomer` and `SendDiscountEmail` are durable units of work. Suppose the workflow first runs at 11:59, going down the first branch and calling `ChargeCustomer` . Say the worker crashes immediately after that activity completes.

The workflow is appended onto some worker queue, and is then popped and re-executed at 12:01pm. In this second run, the replayed workflow would go down the second branch and call `SendDiscountEmail` instead, resulting in a completely different outcome. 

Putting the time read in its own durable step would allow this workflow to be executed correctly every single time it replays, as the result of the time read would not change.

## DBOS

In DBOS, workflows, steps, queue state, schedules, notifications, etc. are all managed by a single Postgres instance. 

Their execution context follows a two-level model consisting of **workflows** and **steps**. Steps are run synchronously as part of its parent workflow, and workflows can trigger other workflows and wait on their results.

Its main functionality can be encapsulated into two tables: `workflow_status` and `operation_outputs` (fields omitted for clarity):

```sql
CREATE TABLE %s.workflow_status (
    workflow_uuid TEXT PRIMARY KEY,
    status TEXT,
    name TEXT,
    request TEXT,
    output TEXT,
    error TEXT,
    executor_id TEXT,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(epoch FROM now())::numeric * 1000)::bigint,
    updated_at BIGINT NOT NULL DEFAULT (EXTRACT(epoch FROM now())::numeric * 1000)::bigint,
    recovery_attempts BIGINT DEFAULT 0,
    queue_name TEXT,
    workflow_timeout_ms BIGINT,
    workflow_deadline_epoch_ms BIGINT,
    inputs TEXT,
    started_at_epoch_ms BIGINT,
    // ... user metadata, application version metadata
);

CREATE TABLE %s.operation_outputs (
    workflow_uuid TEXT NOT NULL,
    function_id INTEGER NOT NULL,
    function_name TEXT NOT NULL DEFAULT '',
    output TEXT,
    error TEXT,
    child_workflow_id TEXT,
    PRIMARY KEY (workflow_uuid, function_id),
    FOREIGN KEY (workflow_uuid) REFERENCES %s.workflow_status(workflow_uuid) 
        ON UPDATE CASCADE ON DELETE CASCADE
);
```

`workflow_status` contains one row per workflow execution. On start, the workflow's inputs are serialized into the `inputs` field, and on completion its result is serialized into the `output` field. 

`operation_outputs` logs the step checkpoints, with one row per durable step (`function_id`) within a workflow. 

When a user calls `dbos.RunWorkflow(ctx, workflowFn, "")`, the workflow is enqueued into the `workflow_status` table with status `PENDING`. This way, if the process dies immediately after, recovery can find this row and re-run it. The input is also serialized into this row, allowing for reconstruction completely from the database. Execution then starts on a separate goroutine, returning a handle to the client that can wait for results using a shared channel. 

Within the workflow function, steps are run by calling `dbos.RunAsStep(ctx, stepFn)`. Before the step is executed, `operation_outputs` is queried for that workflow id and function id:

```go
// workflow.go

recordedOutput, err := retryWithResult(c, func() (*recordedResult, error) {
	return c.systemDB.checkOperationExecution(uncancellableCtx, checkOperationExecutionDBInput{
		workflowID: stepState.workflowID,
		stepID:     stepState.stepID,
		stepName:   stepOpts.stepName,
	})
}, withRetrierLogger(c.logger))
```

If a row already exists, then this step has already been run, and thus the output is immediately returned without executing the function body. Otherwise, the step function body is executed with configureable retires and backoff. After execution is finished, the outputs are inserted into `operation_outputs`: 

```go
// workflow.go

dbInput := recordOperationResultDBInput{
	workflowID:    stepState.workflowID,
	stepName:      stepOpts.stepName,
	stepID:        stepState.stepID,
	errStr:        serializedStepErr,
	startedAt:     stepStartTime,
	completedAt:   stepCompletedTime,
	output:        encodedStepOutput,
	serialization: ser.Name(),
}
recErr := retry(c, func() error {
	return c.systemDB.recordOperationResult(uncancellableCtx, dbInput)
}, withRetrierLogger(c.logger))
```

Finally, when all the steps are completed, the existing row in `workflow_status` is updated to have status `SUCCESS` and its outputs serialized:

```go
// workflow.go

recordErr := retry(c, func() error {
	return c.systemDB.updateWorkflowOutcome(uncancellableCtx, updateWorkflowOutcomeDBInput{
		workflowID: workflowID,
		status:     status,
		errStr:     serializedErr,
		output:     encodedOutput,
	})
}, withRetrierLogger(c.logger))
```

The database overhead is purposely minimal: one database write at the end of each step, to checkpoint its outcome, and two additional database writes per workflow, one at the beginning to checkpoint its inputs and one at the end to checkpoint the outcome. 

### Durable Queues

Queues are implemented using the `workflow_status` as well. Queues are registered by name before DBOS is launched. On startup, a queue runner runs and polls the `workflow_status` table for rows with that queue name. Workflows can then be submitted with an optional queue name parameter:

```go
// queue.go
func (qr *queueRunner) run(ctx *dbosContext) {
	// Build map of queues to listen to
	queuesToListenMap := make(map[string]WorkflowQueue)
	for _, queue := range qr.workflowQueueRegistry {
		if queue.listen {
			queuesToListenMap[queue.Name] = queue
		}
	}

	...

	for _, queue := range queuesToListenMap {
		qr.queueGoroutinesWg.Add(1)
		go qr.runQueue(ctx, queue)
	}

	// Wait for all queue goroutines to complete
	qr.queueGoroutinesWg.Wait()
	qr.logger.Debug("All queue goroutines completed")
	qr.completionChan <- struct{}{}
}

func (qr *queueRunner) runQueue(ctx *dbosContext, queue WorkflowQueue) {
	defer qr.queueGoroutinesWg.Done()

	queueLogger := qr.logger.With("queue_name", queue.Name)
	// Current polling interval starts at the base interval and adjusts based on errors
	currentPollingInterval := queue.basePollingInterval

	for {
		...

		// Build list of partition keys to dequeue from
		// Default to empty string for non-partitioned queues
		partitionKeys := []string{""}
		if queue.PartitionQueue {
			partitions, err := retryWithResult(ctx, func() ([]string, error) {
				return ctx.systemDB.getQueuePartitions(ctx, queue.Name)
			}, withRetrierLogger(queueLogger))
			...
		}

		// Dequeue from each partition (or once for non-partitioned queues)
		if !skipDequeue {
			var dequeuedWorkflows []dequeuedWorkflow
			for _, partitionKey := range partitionKeys {
				workflows, shouldContinue := qr.dequeueWorkflows(ctx, queue, partitionKey, &hasBackoffError)
				if shouldContinue {
					continue
				}
				dequeuedWorkflows = append(dequeuedWorkflows, workflows...)
			}
			...
		
			for _, workflow := range dequeuedWorkflows {
				// Find the workflow in the registry. Configured instance workflows are
				// registered under a name qualified with their config name.
				lookupName := workflow.name
				if workflow.configName != nil && *workflow.configName != "" {
					lookupName = instanceQualifiedName(workflow.name, *workflow.configName)
				}
				wfName, ok := ctx.workflowCustomNametoFQN.Load(lookupName)

				registeredWorkflowAny, exists := ctx.workflowRegistry.Load(wfName.(string))

				registeredWorkflow, ok := registeredWorkflowAny.(WorkflowRegistryEntry)


				// Pass encoded input directly - decoding will happen in workflow wrapper when we know the target type
				_, err := registeredWorkflow.wrappedFunction(ctx, workflow.input, workflow.serialization, WithWorkflowID(workflow.id), withIsDequeue())

			}
		}

		// jitter/retry polling intervals
		...
		
		select {
		case <-ctx.Done():
			queueLogger.Debug("Queue goroutine stopping due to context cancellation", "cause", context.Cause(ctx))
			return
		case <-time.After(sleepDuration):
			// Continue to next iteration
		}
	}
}
```

## Building my own mini durable workflow package

A few design goals I had in mind when constructing my own version:
1. I wanted the interface to match DBOS's. I'm a fan of their simple, no-frills, minimal setup approach in their golang SDK, and thus I wanted to have a similar, if not identical, API surface to theirs.
2. I enabled queues by default - asynchronously running workflows in a queue seemed to be the most common use to me. I also limited workflows to a single queue - multiple queues will have to come in a later iteration. 
3. The DBOS queue runner polls to listen to enqueued work. While this works just fine, I wanted to utilize Postgres's `LISTEN/NOTIFY` capabilities and implement a PubSub handler (no particular reason, just thought this would be interesting to explore). 
4. MINIMAL LLM usage. Part of this is I wanted to learn Go. Never used it in a hobby nor professional setting and I wanted to see what I can achieve and learn on my own. I don't claim to be a go expert by any means so a lot of this code is rough around the edges.

I decided to name this library Rook. Been playing a lot of *Rainbow 6 Siege* lately and I felt the Rook operator thematically appropriate for a library about durability.  

<figure>
  <img src="/assets/rook.png" alt="Rook, the defensive operator from Rainbow Six Siege" />
  <figcaption>Rook, the Rainbow Six Siege operator. His gadget drops armor plates for his team. Fitting for a library all about durability.</figcaption>
</figure>

The database tables follow a similar structure to DBOS:

```sql
CREATE TABLE queue (
    id            BIGSERIAL PRIMARY KEY,
    workflow_id   TEXT NOT NULL,
    queue_name    TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    runtime       INTEGER,
    status        TEXT NOT NULL CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'ERROR')),
    workflow      JSONB NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL,
    started_at    TIMESTAMPTZ,
    completed_at  TIMESTAMPTZ
);

CREATE INDEX idx_queue_name_status ON queue (queue_name, status);

CREATE TABLE log (
    id         BIGSERIAL PRIMARY KEY,
    step_id    TEXT NOT NULL,
    step_name  TEXT NOT NULL,
    log_type   TEXT NOT NULL CHECK (log_type IN ('step_start', 'step_finish')),
    data       JSONB,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_log_step_name ON log (step_name);
```

Args are serialized in the `workflow` column, which contains a serialized struct:
```go
type WorkflowData struct {
	WorkflowID string `json:"workflow_id"`
	Name       string `json:"name"`
	Runtime    int    `json:"runtime"`
	Args       any    `json:"args"`
}
```

When `RunWorkflow` is run, the functions name, arguments, and other metadata are serialized and enqueued into the `queue` table:

```go
// workflow.go

func RunWorkflow[P any, R any](ctx RookContext, workflow Workflow[P, R], args P, opts ...WorkflowOption) (WorkflowHandle[R], error) {
	workflowName := GetFQN(workflow)

	params := workflowOptions{}
	for _, opt := range opts {
		opt(&params)
	}

	if params.WorkflowID == "" {
		params.WorkflowID = uuid.New().String()
	}

	ctx.RegisterOpts(params.WorkflowID, opts)

	workflowData := WorkflowData{
		WorkflowID: params.WorkflowID,
		Name:       workflowName,
		Args:       args,
		Runtime:    10,
	}

	queueID, err := ctx.EnqueueWorkflow(&workflowData)
	if err != nil {
		return nil, err
	}

	return &workflowHandle[R]{
		queueID:    queueID,
		workflowID: params.WorkflowID,
		queue:      ctx.GetQueue(),
		dispatcher: ctx.GetDispatcher(),
	}, nil
}
```

Added rows to the `queue` table are handled using a Notifier and Listener pattern I took from [Jon Brown's blog](https://brojonat.com/posts/go-postgres-listen-notify/). 

```go
// listener.go
type Listener interface {
	Close(ctx context.Context) error
	Connect(ctx context.Context) error
	Listen(ctx context.Context, topic string) error
	Ping(ctx context.Context) error
	Unlisten(ctx context.Context, topic string) error
	WaitForNotification(ctx context.Context) (*Notification, error)
}

// notifier.go

type Notifier interface {
	// Returns a Subscription to the supplied channel topic which can be used to by
	// the caller to receive data published to that channel
	Listen(channel string) Subscription

	// this runs the receiving loop forever
	Run(ctx context.Context) error
}

// Subscription provides a means to listen on a particular topic. Notifiers
// return Subscriptions that callers can use to receive updates.
type Subscription interface {
	NotificationC() <-chan []byte
	EstablishedC() <-chan struct{}
	Unlisten(ctx context.Context)
}
```

Upon startup, we grab our listener and wait for a notification from the subscription:

```go
func (rctx *rookContext) Launch() {
	go rctx.notifier.Run(rctx.ctx)

	sub := rctx.notifier.Listen(rctx.queueName)

	rctx.logger.Info("Starting Queue Loop")
	go func() {
		<-sub.EstablishedC()
		ctx := rctx.ctx
		for {
			for {
				queueEntry, err := rctx.queue.Pop(ctx)
				if errors.Is(err, pgx.ErrNoRows) {
					break
				}
				if err != nil {
					rctx.logger.Error("error popping queue", "err", err)
					break
				}
				rctx.runQueueEntry(ctx, queueEntry)
			}

			select {
			case <-ctx.Done():
				rctx.logger.Info("worker shutting down", "err", ctx.Err())
				return
			case p := <-sub.NotificationC():
				rctx.logger.Debug("got notification", "payload", string(p))
			case <-time.After(5 * time.Second):
			}
		}
	}()
}
```

`runQueueEntry` contains calling code to run the enqueued workflow. 

Finally, when a step is reached in `RunStep`, just like every other durable execution framework we first check if the step has been executed first and return its result. Otherwise, we run the step function: 

```go
func RunStep[P any, R any](ctx RookContext, fn Step[P, R], args P) (R, error) {
	var zero R
	stepName := GetFQN(fn)

	workflowID, err := ctx.GetWorkflowID()

	if err != nil {
		return zero, fmt.Errorf("There was an error getting workflow id: %v", err)
	}

	stepID := fmt.Sprintf("%s-%s", workflowID, stepName)

	// before beginning the step we check the log if we already did it
	data, found, err := ctx.GetFinishedStep(stepID)
	if err != nil {
		return zero, fmt.Errorf("There was an error fetching finished log for step %s: %v", stepID, err)
	}

	if found {
		var out R
		if err := json.Unmarshal(data, &out); err != nil { // ✓ concrete R
			return zero, fmt.Errorf("replay unmarshal: %w", err)
		}

		return out, nil
	}

	res, err := fn(ctx, args)
	ctx.Logger().Debug("step result", "step", stepName, "res", res)
	if err != nil {
		return zero, fmt.Errorf("There was an error running step %s: %v", stepName, err)
	}

	resData, err := json.Marshal(res)
	if err != nil {
		return zero, fmt.Errorf("unable to serialize step result %s: %w", stepName, err)
	}
	err = ctx.FinishStep(stepName, stepID, resData)

	if err != nil {
		return zero, fmt.Errorf("There was an error running step %s: %v", stepName, err)
	}

	return res, nil
}

```

Here's a quick example you can use to play around with this package:

```go
func TestWorkflow(ctx rook.RookContext, input int) (int, error) {
	res, err := rook.RunStep(ctx, Double, input)
	if err != nil {
		return 0, err
	}
	res, err = rook.RunStep(ctx, Triple, res)
	if err != nil {
		return 0, err
	}
	return res, nil
}

func Double(ctx rook.RookContext, input int) (int, error) {
	return 2 * input, nil
}

func Triple(ctx rook.RookContext, input int) (int, error) {
	return 3 * input, nil
}

func main() {
	ctx := context.Background()
	
	// db initialization
	...
	
	rookContext := rook.NewRookContext(ctx, dbURL, "workflows")
	rookContext.Launch()
	rook.RegisterWorkflow(rookContext, TestWorkflow)

	handle, err := rook.RunWorkflow(rookContext, TestWorkflow, 5)
	
	// 30
	res, err := handle.GetResult(ctx)
}


```

Again, this code is not perfect, and there's a lot of functionality that's missing. I don't handle multiple queues. I also don't handle child workflow idempotency very well. My workflow reclaimation assumes that long running workflows past their runtime are dead and spins up a new goroutine, as opposed to cancelling the existing one. I don't have a worker pool implementation, nor do I have runtime/retry logic for workflows/steps. I also don't have workflow/step versoining, which is natively supported in both DBOS and Temporal. 

Turns out, a lot of work goes into a fully productionized durable execution system. Nevertheless, building this was a fruitful exercise and I certainly plan to expand this out in the future. 

## Referenced Works

- DBOS Documentation. [https://docs.dbos.dev/](https://docs.dbos.dev/)
- Jack Vanlightly, "Demystifying Determinism in Durable Execution." [https://jack-vanlightly.com/blog/2025/11/24/demystifying-determinism-in-durable-execution](https://jack-vanlightly.com/blog/2025/11/24/demystifying-determinism-in-durable-execution)
- Jack Vanlightly, "The Durable Function Tree, Part 1." [https://jack-vanlightly.com/blog/2025/12/4/the-durable-function-tree-part-1](https://jack-vanlightly.com/blog/2025/12/4/the-durable-function-tree-part-1)
- Jon Brown, "Postgres LISTEN/NOTIFY in Go." [https://brojonat.com/posts/go-postgres-listen-notify/](https://brojonat.com/posts/go-postgres-listen-notify/)








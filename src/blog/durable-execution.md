---
title: What's the Deal With Durable Execution?
date: 2026-06-30
description: An overview of durable workflows, DBOS internals, and how I built my own toy version.
image: /assets/engraving.png
---

A few weeks ago, I came across a fascinating interview with database pioneer Michael Stonebraker, creator of Postgres. In that interview, he described his shared vision with Matei Zaharia for an operating system backed by a database. [Their research](https://vldb.org/pvldb/vol15/p21-skiadopoulos.pdf) became the foundation for DBOS, their developer-facing durable execution framework. 

Having used Temporal extensively at work, the concept of a durable execution system powered by a single Postgres instance was immediately appealing. I've heard of DBOS before as a Temporal alternative, but I've never taken time to really explore its internals in depth. 

Durability has become a central concern in agentic development. Agent tasks are ephemeral, and should be. An agent *should* have the capability to spin up thousands of subtasks in parallel and let them complete, retry, or fail. However, the state they produce and depend on is often not ephemeral. The agent's plan, its context, approvals, retries, and execution history need to outlive any singular worker process.

This makes having a disk-backed solution that stores the state of the agent, as well as the individual steps of its execution, incredibly desirable. We've seen this in the growing popularity of Cloudflare's Durable Objects, which address the state component, and tools like Temporal and DBOS, which address storing the outputs of intermediate steps. 

Before diving into DBOS, however, it would be good to provide a quick overview of durable workflows and the theory behind them. 

Durable execution takes a function and records its completion and result in an external store. Its execution is reliable by allowing subsequent retries to fetch and replay those results instead of repeating work. That way, if a worker crashes midway through a long-running workflow, its intermediate steps are saved and can be fetched upon a retried execution. Typically, these functions are side effects, such as an API call, a database write, communicating with another service, etc. Work that can fail but can be retried within a broader context. 

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

Each of the functions, `getOrder`, `populateOrder`, and `chargeCustomer` are individual steps whose outputs would be recorded in an external store upon completion. 

In the case of failure, say, if `populateOrder` returns an error for example, we run `ProcessWorkOrder` again from the top. The second time this workflow is run we don't need to execute the database read again. We get the output of the previous run's `getOrder` call from our external store and skip that first step. 

While simple, the implications are enormous.

When you compose a workflow of multiple durable steps, what you get is a tree of function executions. Each function can be suspended, freeing the underlying orchestrator (event loop, separate workers, etc.) to execute another piece of work. The suspended function only needs to resume once its children workflows and steps have finished running without occupying a worker while it waits. 

This tree structure of function calls means that failures and retries are contained within each function's execution context. A single step can be retried hundreds of times without restarting the workflow from scratch. Parts of the workflow can also remain suspended indefinitely until an external signal allows resumption. This paradigm plays nicely with "human-in-the-loop" workflows, in which an agent may have to wait for hours at a time before receiving a human response. 

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

The workflow is re-appended onto some worker queue, and is then popped and re-executed at 12:01pm. In this second run, the replayed workflow would go down the second branch and call `SendDiscountEmail` instead, resulting in a completely different outcome. 

Putting the time read in its own durable step would allow this workflow to be executed correctly every single time it replays, as the result of the time read would not change.

Now let's look at DBOS.

## DBOS

In DBOS, workflows, steps, queue state, schedules, notifications, etc. are all managed by a single Postgres instance. 

Their execution context follows a two-level model consisting of **workflows** and **steps**. Steps are run synchronously as part of their parent workflow, and workflows can trigger other workflows and suspend (wait) on their results.

Its main functionality can be encapsulated into two tables: `workflow_status` and `operation_outputs` (fields omitted for clarity):

```sql
CREATE TABLE workflow_status (
    workflow_uuid TEXT PRIMARY KEY,
    status TEXT,
    name TEXT,
    inputs TEXT,
    output TEXT,
    error TEXT,
    queue_name TEXT
);

CREATE TABLE operation_outputs (
    workflow_uuid TEXT,
    function_id INTEGER,
    function_name TEXT,
    output TEXT,
    error TEXT,
    child_workflow_id TEXT
);
```

`workflow_status` contains one row per workflow execution. On start, the workflow's inputs are serialized into the `inputs` field, and on completion its result is serialized into the `output` field. 

`operation_outputs` logs the step checkpoints, with one row per durable step (`function_id`) within a workflow. 

When a user calls `dbos.RunWorkflow(ctx, workflowFn, "")`, the workflow is enqueued into the `workflow_status` table with status `PENDING`. This way, if the process dies immediately after, recovery can find this row and re-run it. The input is also serialized into this row, allowing for reconstruction completely from the database. Execution then starts on a separate goroutine, returning a handle to the client that can wait for results using a shared channel. 

Within a workflow function, steps are run by calling `dbos.RunAsStep(ctx, stepFn)`. Before the step is executed, `operation_outputs` is queried for that workflow id and function id:

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

If a row already exists, then this step has already been run and the output is immediately returned without executing the function body. Otherwise, the step function body is executed with configureable retires and backoff. After execution is finished, the outputs are inserted into `operation_outputs`: 

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

The database overhead is minimal: one database write at the end of each step, to checkpoint its outcome, and two additional database writes per workflow, one at the beginning to checkpoint its inputs and one at the end to checkpoint the outcome. DBOS claims that they're able to achieve [43k workflows per second](https://www.dbos.dev/blog/benchmarking-workflow-execution-scalability-on-postgres) with this many writes, although your mileage may vary depending on the number of steps.

### Durable Queues

At a high level, DBOS queues are just workflows in `workflow_status` that have a nonempty `queue_name` field. A queue runner periodically scans `workflow_status` for rows that match its queue name, claims a batch of work, looks up the registered workflow by name, deserializes the stored inputs, and invokes the workflow from there:

```go
// pseudocode
for {
    workflows := dequeuePendingWorkflows(queueName)
    for _, workflow := range workflows {
        fn := registry.Lookup(workflow.Name)
        dbos.RunWorkflow(ctx, workflow.Inputs)
    }
    sleep()
}
```

There's a bit of reflection/generic-wrapper machinery that goes on behind the scenes for this to work. For example, the function called in both the queued and not queued paths is the same (`dbos.RunWorkflow`), meaning that the queue runner needs to grab a reference to the underlying workflow function. To support this, `dbos` maintains an in-memory map of workflow names to "wrapped" workflow functions. The wrapper handles generic argument/result types and creates the handle users await for results. This map is manually built by the user by calling `dbos.RegisterWorkflow`. There's also an entire serialization module that I won't go over that covers serialization of arguments and results. Like many things in systems, things are easy to describe, but hard to build. Durable queues is one of them. 

## Building my own mini durable workflow package

A few design goals I had in mind when constructing my own version:
1. I wanted the interface to match DBOS's. I'm a fan of their simple, no-frills, minimal setup approach in their golang SDK, and thus I wanted to have a similar, if not identical, API surface to theirs.
2. I enabled queues by default - asynchronously running workflows in a queue seemed to be the most common use to me. I also limited workflows to a single queue - multiple queues will have to come in a later iteration. 
3. The DBOS queue runner polls to listen to enqueued work. While this works just fine, I wanted to utilize Postgres's `LISTEN/NOTIFY` capabilities and implement a PubSub handler (no particular reason, just thought this would be interesting to explore). 
4. Minimal LLM usage. Part of this is I wanted to learn Go. Never used it in a hobby nor professional setting and I wanted to see what I can achieve and learn on my own. I don't claim to be a go expert by any means so a lot of this code is quite rough around the edges. 

I decided to name this library Rook. Been playing a lot of *Rainbow 6 Siege* lately and I felt the Rook operator thematically appropriate for a library about durability.  

<figure>
  <img src="/assets/rook.png" alt="Rook, the defensive operator from Rainbow Six Siege" />
  <figcaption>Rook, the Rainbow Six Siege operator. His gadget drops armor plates for his team. Fitting for a library all about durability.</figcaption>
</figure>

Rook is intentionally much smaller, and I go over many of its limitations towards the end. The goal was to reproduce the core durable execution functionality: persist a workflow execution and its steps such that subsequent runs don't repeat any work. 

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

When `RunWorkflow` is run, the function's name, arguments, and other metadata are serialized and enqueued into the `queue` table:

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

Added rows to the `queue` table are handled using a Notifier and Listener pattern I took from [Jon Brown's blog](https://brojonat.com/posts/go-postgres-listen-notify/). When `RunWorkflow` inserts a new pending workflow, the worker receives a notification, fetches any pending row, and runs the corresponding workflow by looking up its registered function name. Upon startup, we subscribe to our listener and wait for a notification:

```go
// pseudo code for Launch()

go notifier.Run(ctx)

for {
    for {
        entry := queue.Pop(ctx)
        if entry == nil {
            break
        }
        runQueueEntry(ctx, entry)
    }

    waitForNotificationOrTimeout()
}
```

`runQueueEntry` contains calling code to run the enqueued workflow. 

Finally, when a step is reached in `RunStep`, we first check if the step has been completed and return its result. Otherwise, we run the step function: 

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

Here's a quick example:

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

In this example, the execution trace looks something like this:
```
RunWorkflow(TestWorkflow, 5)
→ insert PENDING row into queue
→ NOTIFY workflows
→ worker wakes up
→ Pop() claims pending row
→ runQueueEntry executes registered workflow
→ RunStep checkpoints Double and Triple
→ handle.GetResult returns 30
```

Again, this code is not perfect, and there's a lot of functionality that's missing. I don't handle multiple queues. I also don't handle child workflow idempotency very well. My workflow reclamation assumes that long-running workflows past their runtime are dead and spins up a new goroutine, as opposed to cancelling the existing one. I don't have a worker pool implementation, nor do I have runtime/retry logic for workflows/steps. I also don't have workflow/step versioning, which is natively supported in both DBOS and Temporal. 

Turns out, a lot of work goes into a fully productionized durable execution system. Nevertheless, building this was a fruitful exercise and I certainly plan to expand this out in the future. 

## Referenced Works

- DBOS Documentation. [https://docs.dbos.dev/](https://docs.dbos.dev/)
- Jack Vanlightly, "Demystifying Determinism in Durable Execution." [https://jack-vanlightly.com/blog/2025/11/24/demystifying-determinism-in-durable-execution](https://jack-vanlightly.com/blog/2025/11/24/demystifying-determinism-in-durable-execution)
- Jack Vanlightly, "The Durable Function Tree, Part 1." [https://jack-vanlightly.com/blog/2025/12/4/the-durable-function-tree-part-1](https://jack-vanlightly.com/blog/2025/12/4/the-durable-function-tree-part-1)
- Jon Brown, "Postgres LISTEN/NOTIFY in Go." [https://brojonat.com/posts/go-postgres-listen-notify/](https://brojonat.com/posts/go-postgres-listen-notify/)


export const PROJECTS = [
  {
    title: "GossipScale",
    description:
      "A distributed and performant implementation of the gossip learning paradigm forked from FedScale. GossipScale was built using gRPC to handle aggregator-executor communication, simulated using individual gRPC servers as individual nodes, in addition to dynamic weight aggregation based off of executor health. Executor selection is performed with nearest-neighbors using execution time as heuristic.",
    techStack: ["python", "gRPC", "pytorch"],
    link: "/assets/GossipScale_Final_Report.pdf",
  },
  {
    title: "Partita",
    description:
      "A quantized version of ProxylessGaze usingProxylessNAS (Cai et al.), a model created using efficient Neural Architecture Search by training a single overparmeterized model on a single task rather than multiple 'normal'-sied ones. Quantization was performed using both kmeans quantization and linear quantization, modifying the model backbone produced by the ProxylessNAS procedure. Partita saw performance boosts in both framerate and model size.",
    techStack: ["python", "pytorch", "onnx"],
    link: "/assets/TinyML_Project_Report.pdf",
  },
  {
    title: "Interpretable Distilled Language Models",
    description:
      "An in-depth study on model interpretability between BERT and DistilBERT. Compared different interpretability methods including SHAP, LIME, and IntegratedGradients, while attempting a novel weight aggregation method during knowledge distillation to preserve weight alignment across GLUE tasks.",
    techStack: ["python", "pytorch"],
    link:
      "/assets/CS_282_Final_Report___Towards_Distilled_Language_Model_Interpretability.pdf",
  },
  {
    title: "NATNet",
    description:
      "Generation and neural audio transformation of networks to simulate guitar amplifier and pedal effects. Effects were generated using a mixture of WaveNet models and Gated Convolutional Networks (GCN), and interpolated across effect weights to create linear ranges of sounds. VST plugins and pedals were tested using Neutone and Ableton. Further studies of implicit audio representation of effects using VAEs, showing faithful reconstructions of popular guitar sounds from Jimi Hendrix, John Mayer, and Jerry Garcia.",
    techStack: ["python", "pytorch", "ableton", "neutone"],
    link: "",
  },
  {
    title: "Network Compression via Network Memoization",
    description:
      "Implicit Neural representations of graphs by training neural-networks to memorize and predict corresponding edge existences between two nodes. Testing methodology included random graph generation using Erdos-Reyni graph generation and the Watts-Strogat model Using sinusoidal representation networks (SIREN)s with 10 layers of 28 nodes each, we were able to reconstruct graph images with compression ratios up to 100x. ",
    techStack: ["python", "pytorch"],
    link:
      "/assets/CS_282_Final_Report___Towards_Distilled_Language_Model_Interpretability.pdf",
  },
  {
    title: "Wave Learning Festival ",
    description: `Built fullstack application used by over 10000 students worldwide in more than 60 countries. Redesigned technical workflow by creating CI/CD infrastructure on AWS Amplify servers with DynamoDB Backend, S3 storage, Lambda function deployments, and GraphQL. Check it out at www.wavelf.org!`,
    techStack: [
      "React",
      "AWS DynamoDB",
      "AWS Cognito",
      "AWS Amplify",
      "Lambda",
      "GraphQL",
    ],
    link: "",
  },
  {
    title: "OwlOS",
    description:
      "OwlOS is a multicore x86-64 operating system that that supports syscalls, multithreading, and virtual memory. Includes caching, synchronization objects such as spinlocks, waitqueues, and futexes, a virtual file system, and an on-disk file system with directory trees. ",
    techStack: ["C++"],
    link: "",
  },
  {
    title: "Wikipedia Topic Modeling",
    description:
      "Designed a topic visualizer for Wikipedia articles using BERT embeddings and clustering to generate individual topics. Created flask backend and typescript graph editor tool for visualization",
    techStack: ["Python", "Flask", "transformers"],
  },
  {
    title: "ML-Based Spotify Curator",
    description:
      "Devised a song preference predictor by analyzing playlists  \
            and liked songs on Spotify. Utilized a random forest classifier \
            to examine empirical song data from a user to predict whether \
            they would like an inputted song or not. Tuned to perform at \
            75% accuracy. Model training and predictions are stored in a \
            distributed task queue and picked up asynchronously by Celery \
            workers. Redis serves as both a message broker and result store \
            for the queue. Made in collaboration with Jeremy Hsu.",
    techStack: [
      "Python",
      "Flask",
      "Pandas",
      "Scikit-learn",
      "React.js",
      "Celery",
      "Redis",
    ],
    link: "",
  },
  {
    title: "Text Summarizer",
    description:
      "Uses open source Python summarizing (Sumy) library and webscraping to create \
      dynamic summaries of text, online articles, and scanned papers, with support for different \
      types of output and input files. Written with Flask Backend, hosted on AWS Elastic Beanstalk, \
      and React.js, hosted using Amplify with AWS Cognito user authentication.",
    techStack: [
      "Python",
      "AWS Elastic Beanstalk",
      "AWS Cognito",
      "AWS Amplify",
      "React",
    ],
    link: "",
  },
  {
    title: "Personal website 2019",
    description:
      "Wrote this website in < 1 day and deployed ASAP on github pages using only bootstrap + html + css. Finally retired the website in 2021.",
    techStack: ["HTML", "CSS", "Bootstrap"],
    link: "",
  },
];

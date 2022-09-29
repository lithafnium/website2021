export const PROJECTS = [
  {
    title: "Wave Learning Festival ",
    description: `Built frontend React.js app with e2e testing used by over 10000 students worldwide in more than 60 countries. Redesigned technical workflow by creating CI/CD infrastructure on AWS Amplify servers with DynamoDB Backend, S3 storage, Lambda function deployments, and GraphQL. Check it out at www.wavelf.org!`,
    techStack: [
      "React",
      "AWS DynamoDB",
      "AWS Cognito",
      "AWS Amplify",
      "Lambda",
      "GraphQL",
    ],
  },
  {
    title: "ChickadeeOS",
    description:
      "ChickadeeOS is a multicore x86-64 operating system that that supports syscalls, multithreading, and virtual memory. Includes caching, synchronization objects such as spinlocks and futexes, a virtual file system, and an on-disk file system with directory trees. Created for CS161: Operating Systems",
    techStack: ["C++"],
  },
  {
    title: "Wikipedia Topic Modeling",
    description:
      "Designed a topic visualizer for Wikipedia articles using Top2Vec and transformer-based NLP models trained on multilingual data. Created flask backend and typescript graph editor tool for visualization",
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
  },
  {
    title: "Shell",
    description:
      "Created a full-fledged command shell with functionality for fork, exec, \
                  interrupts, pipes, conditional commands background processes, \
                  and redirects. Pipelines were implemented using fork, dup2, and close \
                  in order to manage file descriptors, as well as interruption with process \
                  group control. Created for CS \
                  61 in Fall of 2019. ",
    techStack: ["C++", "Bash"],
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
  },
  {
    title: "Personal website 2019",
    description:
      "Wrote this website in < 1 day and deployed ASAP on github pages using only bootstrap + html + css. Finally retired the website in 2021.",
    techStack: ["HTML", "CSS", "Bootstrap"],
  },
];

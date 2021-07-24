export const PROJECTS = [
  {
    title: "WeensyOS",
    description:
      "Designed a kernel for WeensyOS, a miniature operating system \
    complete with physical and virtual memory, forking, and kernel \
    isolation. Implemented virtual page allocation and memory freeing \
    while accounting for memory leaks and system calls. Created for CS \
    61 in Fall of 2019.",
    techStack: ["C++", "Bash"],
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
            for the queue. Made in collaboration with Jeremy Hsu",
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
      "Uses an open source Python summarizing (Sumy) library and webscraping to \
                 allow users to summarize chunks of text, online articles, scanned papers, \
                 or even online videos. Ultimately, users will be able to choose from \
                 different types of outputs as well: text, pdf, dynamic, video, infographic, etc.\
                Written with Flask Backend (Hosting on AWS Elastic Beanstalk and implementation of \
                  AWS Cognito to be implemented), React frontend.",
    techStack: ["Python", "AWS Elastic Beanstalk", "AWS Cognito", "React"],
  },
  {
    title: "Personal website 2019",
    description:
      "Wrote this website in < 1 day and deployed ASAP on github pages using only bootstrap + html + css. Finally retired the website in 2021.",
    techStack: ["HTML", "CSS", "Bootstrap"],
  },
];

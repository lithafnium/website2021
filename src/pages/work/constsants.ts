export const COMPANIES: any = [
  "Instagram (Meta)",
  "Gamalon",
  "Amazon",
  "Fractal",
  "Wave Learning Festival",
];

export const DESCRIPTIONS: any = [
  {
    role: "Software Engineer Intern ",
    link: "https://www.instagram.com/",
    date: "May 2022 - August 2022",
    description: [
      "Developed internal logging infrastructure using C++ for performance metrics, logging filtering, and crash reports, providing support for multiple Instagram entities (accounts, comments, etc.) on ~100k requests per day.",
      "Designed and built internal tools using React and PHP for testing Instagram filtering/downranking results from ML-generated classifications, reducing testing from hours to minutes and preventing faulty configurations from being pushed to production.",
      "Created soft action enforcement infrastructure to support filtering/downranking for multiple different types of Instagram entities using C++, operating on millions of requests per day.",
    ],
  },
  {
    role: "Machine Learning Engineer Intern ",
    link: "https://gamalon.com/",
    date: "September 2021 - December 2021",
    description: [
      "Developed novel neural network architecture for NLP topic hierarchies based on probabilistic factor graphs using PyTorch,",
      "Designed a suite of CLI tools using Bash, Python, and GPT-3 for model building and question/answer generation, reducing manual business analyst labor from ~4 weeks to ~4 days",
      "Created question answering and response interface with Retrieval-Augmented Generation-inspired algorithms based around google search results through Bayesian decision trees. Competitive with GPT-3 question/answer generation",
    ],
  },
  {
    role: "Software Development Engineering Intern ",
    link: "https://www.amazon.com/",
    date: "June 2021 - August 2021",
    description: [
      "Developed public REST API for resource tagging for Amazon Connect, AWS’s cloud call center, designed to be shipped to hundreds of thousands of customers by September.",
      "Implemented access control support using tagging through IAM roles, allowing for resource allocation and user restriction.",
      "Debugged production code and wrote unit/integration tests required for CI/CD pipelines to maintain AWS cloud resources.",
    ],
  },
  {
    role: "Software Engineering Intern ",
    link: "https://www.fractal.co/",
    date: "Jan 2021 - May 2021",
    description: [
      "Created testing infrastructure with ~10x fewer bugs to ensure quality software using Jest, React-Testing-Library, and Enzyme, complete with Github Actions workflows.",
      "Implemented AWS resource tracking with logz.io docker integrations and slack notifications through Github Actions workflows to monitor EC2 instances and ECS clusters, saving thousands of dollars in sunk costs.",
      "Developed Electron.js app and Flask Python webserver functionality with e2e and documentation",
    ],
  },
  {
    role: "Co-Founder and Technology Co-Lead ",
    link: "https://www.wavelf.org/",
    date: "June 2020 - July 2021",
    description: [
      "Co-Founded Wave Learning Festival, an online learning platform aimed to bridge the gap in academic disparity through free tutoring and online seminars. ",
      "Built frontend React.js app with e2e testing used by over 10000 students worldwide in more than 60 countries. Redesigned technical workflow by creating CI/CD infrastructure on AWS Amplify servers with dynamoDB Backend and GraphQL.",
      "Created content management system for Operations team to assist in managing thousands of student data and hundreds of teachers and courses.",
    ],
  },
];

export const COMPANIES: any = [
  "Amazon",
  "Fractal",
  "Pine Park Health",
  "Wave Learning Festival",
  "HSA Dev",
  "Concordium",
];

export const DESCRIPTIONS: any = [
  {
    role: "Software Development Engineering Intern",
    link: "https://www.amazon.com/",
    date: "June 2021 - Present",
    description: [
      "Developed public REST API for resource tagging for Amazon Connect, AWS’s cloud call center, designed to be shipped to hundreds of thousands of customers by September.",
      "Implemented access control support using tagging through IAM roles, allowing for resource allocation and user restriction.",
      "Debugged production code and wrote unit/integration tests required for CI/CD pipelines to maintain AWS cloud resources.",
    ],
  },
  {
    role: "Software Engineering Intern",
    link: "https://www.fractal.co/",
    date: "Jan 2021 - May 2021",
    description: [
      "Created testing infrastructure with ~10x fewer bugs to ensure quality software using Jest, React-Testing-Library, and Enzyme, complete with Github Actions workflows.",
      "Implemented AWS resource tracking with logz.io docker integrations and slack notifications through Github Actions workflows to monitor EC2 instances and ECS clusters, saving thousands of dollars in sunk costs.",
      "Developed Electron.js app and Flask Python webserver functionality with e2e and documentation",
    ],
  },
  {
    role: "Software Engineering Intern",
    link: "https://www.pineparkhealth.com/",
    date: "June 2020 - Sept 2020",
    description: [
      "Created frontend UI elements to display user tasks and patient symptoms, increasing productivity and ensuring patient safety using Vue.js for Toggbook, an application aimed at managing medical staff in assisted living communities.",
      "Implemented REST API using PostgreSQL and Node.js, to manage and store thousands of patients and staff over 21 health-care facilities. Improved automation and monitoring by creating a streamlined data platform connecting a central store to the database, saving days of manual labor.",
    ],
  },
  {
    role: "Co-Founder and Technology Co-Lead",
    link: "https://www.wavelf.org/",
    date: "June 2020 - July 2021",
    description: [
      "Co-Founded Wave Learning Festival, an online learning platform aimed to bridge the gap in academic disparity through free tutoring and online seminars. ",
      "Built frontend React.js app with e2e testing used by over 10000 students worldwide in more than 60 countries. Redesigned technical workflow by creating CI/CD infrastructure on AWS Amplify servers with dynamoDB Backend and GraphQL.",
      "Created content management system for Operations team to assist in managing thousands of student data and hundreds of teachers and courses.",
    ],
  },
  {
    role: "Full-Stack Engineer",
    link: "https://www.hsa.dev/",
    date: "Dec 2019 - May 2020",
    description: [
      "Designed buyer and deliverer mobile applications for Hopp, a snack delivery service for college students on campus.",
      "Constructed an administrative dashboard to view sales and monthly reports to improve product management.",
      "Created an API backend using GraphQL connected with an online Shopify store to control products and student runners, developed UI designs with React and React-Native.",
    ],
  },
  {
    role: "Tech Lead",
    link: "https://theconcordium.org/",
    date: "Dec 2019 - May 2020",
    description: [
      "Developed a video calling platform designed to connect thousands of users with student volunteers.",
      "Designed full-user dashboard using React.js, created backend for video conferencing and storing information using Twilio and Firebase.",
    ],
  },
];

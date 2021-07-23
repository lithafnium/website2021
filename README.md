# Zesti Website

> ✨ Bootstrapped with Create Snowpack App (CSA).

This repository contains the code for the Zesti Website. The goal is to make this a completely static website, keeping our needs light and our code clean.

## Setting up for Development

Clone the repository and run `npm install` to install dependencies. Run the website by running `npm start`. Any other commands can be seen inside `package.json`.

## Contributing

If you'd like to contribute to the website, make your changes on a separate branch with the format `FirstnameLastname/Feature`. For example, one name could be `steveli/waitlist-subscribe`. Push your changes and make a pull request into `dev`.

For styling, we use `styled-components` (https://styled-components.com/). Look at some of the components for examples.

Before merging your pull request, your branch must pass all of our CI tests. Currently, the only workflow we have right now is the linter, which you can run on your local machine to see errors by typing in `npm run lint-check` and fixing them with `npm run lint-fix`.

## File Structure

A tree structure is provided below. When making a new file, please add it to this tree so that it stays up to date.

```
.
├── .github/workflows --> folder containing all of our CI workflows
├── public
│   ├── assets --> contains all of our images and other graphics
│   ├── index.css --> global css file
│   └── index.html --> web page for our react app to socket into
│── scripts --> folder containing our npm scripts, to enable better debugging
│   ├── lint-fix.sh --> runs the linter and fixes any errors
│   └── lint-check.sh --> runs the linter
│── src
│   └── @types
│       └── index.d.ts --> abstracts our assets file names so that typescript can recognize them
│   ├── pages --> contains the pages of our website
│   │   └── home --> home page
│   |   |   ├── home.tsx --> react component for the homge page
│   |   |   └── styles.ts --> styling for the home page
│   ├── shared --> any shared values, from components, constants, and other utils
│   │   ├── components
│   |   |   ├── footer --> react component for the footer
│   |   |   |   ├── footer.tsx
│   |   |   |   └── styles.ts
│   |   |   ├── layout --> react components for any layout oriented functionality
│   |   |   |   ├── layout.tsx
│   |   |   |   └── styles.ts
│   |   |   ├── navbar --> react component for the navbar
│   |   |   |   ├── navbar.tsx
│   |   |   |   └── styles.ts
│   |   |   ├── button.ts --> Button component
│   |   |   ├── fade.ts --> fade in component
│   |   |   ├── index.ts --> reducer that exposes all of the shared components
│   |   |   ├── input.ts --> input component
│   |   |   └── slide.tsx --> slide in component
│   │   ├── constants
│   |   |   └── routes.ts --> contains our routes
│   │   └── utils
│   |   |   └── history.ts --> maintains our browser history for react-router
│   ├── styles --> global styles
│   ├── App.tsx --> app component
│   └── index.tsx --> React DOM initialization
│── .eslintrc.js --> eslint config file
│── .gitignore
│── package.json --> lists our dependencies and scripts
│── package-lock.json
│── README.md
│── snowpack.config.js --> config file for snowpack, the frontend build tool that we're using (https://www.snowpack.dev/)
└── tsconfig.json --> typescript configuration

```

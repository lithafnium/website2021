import React from "react";

import Home from "@app/pages/home/home";
import About from "@app/pages/about/about";
import Work from "@app/pages/work/work";
import Projects from "@app/pages/projects/projects";

import CS175 from "@app/pages/cs175project/cs175";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Router } from "react-router";

const Main = () => {
  return (
    <>
      <Home />
      <About />
      <Work />
      <Projects />
    </>
  );
};
const router = createBrowserRouter([
  {
    path: "/cs175",
    element: <CS175 />,
    children: [],
  },
  {
    path: "/",
    element: <Main />,
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

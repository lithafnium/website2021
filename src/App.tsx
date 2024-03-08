import React, { useState } from "react";

import Home from "@app/pages/home/home";
import About from "@app/pages/about/about";
import Work from "@app/pages/work/work";
import Projects from "@app/pages/projects/projects";
import Misc from "@app/pages/misc/misc";

import CS175 from "@app/pages/cs175project/cs175";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Router } from "react-router";
import { Container, Heading, Navbar, NavbarOptions } from "./styles";
import { animated, useTransition } from "react-spring";

const Main = () => {
  const pages = [<About />, <Work />, <Projects />, <Misc />];
  const [items, setItems] = useState([<About />]);
  const setContent = (index: number) => {
    setItems(pages.slice(index, index + 1));
  };
  const transitions = useTransition(items, {
    from: { x: -20, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { y: 20, opacity: 0 },
    // delay: 50,
    config: {
      mass: 10,
      friction: 50,
      tension: 100,
      duration: 200,
    },
    exitBeforeEnter: true,
  });
  return (
    <Container>
      <Heading>
        <Navbar>
          <h2 onClick={() => setContent(0)}>hi, i'm steve</h2>
          <NavbarOptions>
            <p onClick={() => setContent(1)}>work</p>
            <p onClick={() => setContent(2)}>projects</p>
          </NavbarOptions>
        </Navbar>
        {transitions((style, item, t, index) => {
          return (
            <animated.div
              style={{
                ...style,
              }}
            >
              {item}
            </animated.div>
          );
        })}
      </Heading>
    </Container>
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

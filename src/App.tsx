import React from "react";

import About from "@app/pages/about/about";
import Projects from "@app/pages/projects/projects";

import CS175 from "@app/pages/cs175project/cs175";
import Blog from "@app/pages/blog/blog";
import BlogPost from "@app/pages/blog/post";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Container, Heading, Navbar, NavbarOptions } from "./styles";
import { animated, useTransition } from "@react-spring/web";

const tabForPath = (pathname: string): number => {
  if (pathname === "/projects") return 1;
  if (pathname === "/blog") return 2;
  return 0;
};

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pages = [<About />, <Projects />, <Blog />];
  const tab = tabForPath(location.pathname);
  const transitions = useTransition(tab, {
    keys: tab,
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
          <h2 onClick={() => navigate("/")}>hi, i'm steve li</h2>
          <NavbarOptions>
            <p onClick={() => navigate("/projects")}>projects</p>
            <p onClick={() => navigate("/blog")}>blog</p>
          </NavbarOptions>
        </Navbar>
        {transitions((style, t) => {
          return (
            <animated.div
              style={{
                ...style,
              }}
            >
              {pages[t] ?? pages[0]}
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
    path: "/projects",
    element: <Main />,
  },
  {
    path: "/blog",
    element: <Main />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
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

import React from "react";
import { Container, ContainerInner, Project, TechStack } from "./styles";
import { PROJECTS } from "./constants";
const Home = () => {
  return (
    <Container>
      <ContainerInner>
        <h1>projects</h1>
        <p>
          a short collection of what I've done and what I've been working on.
          checkout my <span>Github</span> for more info!
        </p>
        {PROJECTS.map((p) => {
          return (
            <Project>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <TechStack>
                {p.techStack.map((t) => {
                  return <p>{t}</p>;
                })}
              </TechStack>
            </Project>
          );
        })}
      </ContainerInner>
    </Container>
  );
};

export default Home;

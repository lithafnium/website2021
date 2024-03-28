import React from "react";
import { Bold, Link } from "@app/styles/styles";
import {
  Bar,
  ContainerInner,
  Label,
  Project,
  ProjectHeading,
  TechStack,
  ProjectLink,
  Description,
} from "./styles";
import { PROJECTS } from "./constants";
const Home = () => {
  return (
    <ContainerInner>
      <p>
        a collection of my past and current projects. research publications can
        be found at my{" "}
        <Bold>
          <Link href="https://scholar.google.com/citations?user=84BuD6wAAAAJ&hl=en">
            Google Scholar
          </Link>
        </Bold>
      </p>
      {PROJECTS.map((p) => {
        return (
          <Project>
            <ProjectHeading>
              <h3>{p.title}</h3>
              {p.link != "" && <Bar />}
              {p.link != "" && <ProjectLink href={p.link}>paper</ProjectLink>}
            </ProjectHeading>
            <TechStack>
              {p.techStack.map((t) => {
                return (
                  <Label>
                    <p>{t}</p>
                  </Label>
                );
              })}
            </TechStack>
            <Description style={{ marginBottom: "0px" }}>
              {p.description}
            </Description>
          </Project>
        );
      })}
    </ContainerInner>
  );
};

export default Home;

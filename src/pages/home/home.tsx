import React from "react";
import { FadeIn } from "@app/shared/components/index";
import {
  Container,
  ContainerInner,
  Heading,
  Description,
  Paragraph,
  Links,
} from "./styles";

const Home = () => {
  return (
    <Container>
      <ContainerInner>
        <FadeIn>
          <Description>hi, my name is</Description>
          <Heading>steve li.</Heading>
          <Heading style={{ opacity: "0.7" }}>
            i create and build things.
          </Heading>
          <Paragraph>
            i'm a software engineer hoping to make an impact on this world,
            specializing in creating, designing, and deploying exceptional
            digital experiences. currently beep booping at Berkeley NLP.
          </Paragraph>
          <Links>
            <a href="#about">about</a>
            <a href="#work">work experience</a>
            <a href="#projects">projects</a>
            <a href="#coursework">coursework</a>
          </Links>
        </FadeIn>
      </ContainerInner>
    </Container>
  );
};

export default Home;

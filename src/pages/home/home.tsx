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
    <FadeIn>
      <Container>
        <ContainerInner>
          <Description>hi, my name is</Description>
          <Heading>steve li.</Heading>
          <Heading style={{ opacity: "0.7" }}>
            i create and build things.
          </Heading>
          <Paragraph>
            i'm a software engineer hoping to make an impact on this world,
            specializing in creating, desigining, and deploying exceptional
            digital experiences. currently I'm working at Amazon on the AWS
            Connect team.
          </Paragraph>
          <Links>
            <a href="#">about</a>
            <a href="#">work experience</a>
            <a href="#">projects</a>
            <a href="#">coursework</a>
          </Links>
        </ContainerInner>
      </Container>
    </FadeIn>
  );
};

export default Home;

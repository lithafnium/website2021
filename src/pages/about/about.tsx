import React, { useState } from "react";
import { colors, Bold } from "@app/styles/styles";
import { FadeIn } from "@app/shared/components/fade";
import { Container, ContainerInner, Heading, Image } from "./styles";
import Profile from "@app/assets/websitepic-4.jpg";

const About = () => {
  return (
    <>
      <Container>
        <Heading>
          <h1>about me</h1>
          <ContainerInner>
            <Image src={Profile} />
            <div>
              <h2>hey!</h2>
              <p>
                i'm steve, currently a rising sophomore-ish at harvard
                university studying CS + stat. most of my interests lie in
                <Bold> full-stack development </Bold>
                and <Bold>dev-ops integrations</Bold>, but recently i've been
                researching more into systems and computer vision on the side.{" "}
                <Bold>
                  i'm currently seeking a SWE intern position for this fall or
                  the summer of 2022, in addition to any available research.
                </Bold>
              </p>
              <p>
                over the past few years i've had the opportunity to work in
                <Bold> startups</Bold>, found a <Bold>non-profit</Bold> of my
                own, develop technologies at a <Bold>huge corporation</Bold>,
                and work in an <Bold>app development agency.</Bold> right now
                i'm developing technologies at <Bold>Amazon</Bold> on the AWS
                Connect Team.
              </p>
              <p>
                on campus, i toot my oboe in the Harvard Radcliffe Orchestra
                while also snapping some shots for the Harvard Crimson.
                additional hobbies include reading, playing tennis, strumming my
                guitar, and playing with my dog.
              </p>
            </div>
          </ContainerInner>
        </Heading>
      </Container>
    </>
  );
};

export default About;

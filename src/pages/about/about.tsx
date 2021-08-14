import React from "react";
import { Bold, Link } from "@app/styles/styles";
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
                over the past few years, i've had the opportunity to work in
                <Bold>
                  {" "}
                  <Link href="https://www.fractal.co/">startups</Link>
                </Bold>
                , found a{" "}
                <Bold>
                  <Link href="https://www.wavelf.org/">non-profit</Link>
                </Bold>{" "}
                of my own, engineer public-facing APIs at a{" "}
                <Bold>
                  <Link href="https://www.amazon.com/">huge corporation</Link>
                </Bold>
                , and create full-stack applications in an{" "}
                <Bold>
                  <Link href="https://www.hsa.dev/">
                    app development agency.
                  </Link>
                </Bold>{" "}
                right now i'm developing technologies at <Bold>Amazon</Bold> on
                the AWS Connect Team.
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

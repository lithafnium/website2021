// @ts-nocheck
import React, { useState } from "react";
import { Bold, Link } from "@app/styles/styles";
import {
  Bar,
  Container,
  ContainerInner,
  Heading,
  Image,
  Navbar,
  NavbarOptions,
  Social,
  SocialLink,
  Socials,
} from "./styles";
import Profile from "@app/assets/websitepic-4.jpg";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Work from "@app/pages/work/work";
import Projects from "@app/pages/projects/projects";
import { animated, useTransition } from "react-spring";

const About = () => {
  return (
    <ContainerInner>
      <div>
        <p>
          i'm a senior at Harvard studying computer science. my main interests
          lie in AI safety, speech processing, operating systems, and systems
          for machine learning.
        </p>
        <p>
          over the past few years, i've had the opportunity to work in{" "}
          <Bold>
            <Link href="https://gamalon.com/">startups</Link>
          </Bold>
          , found a{" "}
          <Bold>
            <Link href="https://www.wavelf.org/">non-profit</Link>
          </Bold>{" "}
          of my own, engineer public-facing APIs at{" "}
          <Bold>
            <Link href="https://www.roblox.com/">huge corporations</Link>
          </Bold>
          , conduct cutting-edge research with some of the most{" "}
          <Bold>
            <Link href="https://people.eecs.berkeley.edu/~gopala/">
              talented researchers in the country
            </Link>
          </Bold>
          , and build{" "}
          <Bold>
            <Link href="https://datamatch.me/">matching algorithms</Link>
          </Bold>{" "}
          for 30+ colleges and 60k+ students. more recently, I was on the User
          Safety team at Roblox, where I developed reporting features and ML
          classification pipelines to create a safer environment for kids across
          the world.
        </p>
        <p>
          in my other lives, I'm an{" "}
          <Bold>
            <Link href="https://www.youtube.com/watch?v=NJQYvL6J7t4">
              oboist
            </Link>
          </Bold>
          , a{" "}
          <Bold>
            <Link href="https://www.instagram.com/snaps.by.steve/?hl=en">
              photographer
            </Link>
          </Bold>
          , a{" "}
          <Bold>
            <Link href="https://www.instagram.com/p/Ct9z_GzSj07/?img_index=1">
              drummer
            </Link>
          </Bold>{" "}
          for a band, and a washed up tennis player.
        </p>
        <p>
          i'm also an avid{" "}
          <span style={{ fontStyle: "italic" }}>Super Smash Bros. Melee</span>{" "}
          player! shoot me a message if you want to play on Slippi sometime.
        </p>
        <Socials>
          <Social>
            <FaGithub />
            <Bar />
            <p>
              <SocialLink href="https://github.com/lithafnium">
                @lithafnium
              </SocialLink>
            </p>
          </Social>
          <Social>
            <FaTwitter />
            <Bar />
            <p>
              <SocialLink href="https://twitter.com/steveshenli">
                @steveshenli
              </SocialLink>
            </p>
          </Social>
          <Social>
            <IoMdMail />
            <Bar />
            <p>
              <SocialLink href="mailto:steveli@college.harvard.edu">
                steveli@college.harvard.edu
              </SocialLink>
            </p>
          </Social>
        </Socials>
      </div>
    </ContainerInner>
  );
};

export default About;

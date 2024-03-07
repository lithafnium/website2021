import { device, size } from "@app/shared/components/layout/layout";

import styled from "styled-components";
import { grayscale } from "./styles/styles";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 5em;
`;

export const Heading = styled.div`
  position: relative;
  max-width: ${size.tablet};
  width: 100%;
  @media ${device.mobileS} {
    box-sizing: border-box;
    width: 80%;
  }
`;

export const Navbar = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

export const NavbarOptions = styled.div`
  display: flex;
  gap: 2em;
  transition: 0.2s;
  & p {
    margin: 0px;
    color: ${grayscale[500]};
  }

  & p:hover {
    cursor: pointer;
    color: ${grayscale[900]};
  }
`;

export const ContainerInner = styled.div`
  width: 100%;
  & h2 {
    margin-top: 0px;
  }
  & p {
    font-size: 17px;
    color: ${grayscale[800]};
  }
  @media ${device.mobileS} {
    display: block;
  }

  @media ${device.tabletL} {
    display: grid;
  }

  gap: 50px;
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: rgba(2, 12, 27, 0.6) 0px 10px 30px -15px;
`;

export const Socials = styled.div`
  font-size: 1.5em;
`;

export const Social = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  & p {
    margin: 0px;
    font-size: 16px;
  }
`;

export const SocialLink = styled.a`
  text-decoration: none !important;

  color: ${grayscale[500]};
  transition: 0.2s;

  &:hover {
    color: ${grayscale[900]};
    cursor: pointer;
  }
`;

export const Bar = styled.div`
  width: 40px;
  height: 1px;
  background-color: ${grayscale[300]};
`;

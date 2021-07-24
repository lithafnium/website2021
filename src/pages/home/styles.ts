import styled, { keyframes } from "styled-components";
import { device } from "@app/shared/components/layout/layout";
import { colors, fonts } from "@app/styles/styles";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  // background-color: ${colors.TERNARY};
`;

export const ContainerInner = styled.div`
  max-width: 992px;

  @media ${device.mobileS} {
    box-sizing: border-box;
    width: 80%;
  }

  @media ${device.laptopM} {
    padding: 0px 0px;
    width: 100%;
  }
`;

export const Heading = styled.h1`
  @media ${device.mobileS} {
    font-size: 36px;
  }

  @media ${device.tablet} {
    font-size: 72px;
  }
  font-size: 72px;
  margin: 0px;
  font-weight: 700;
  color: ${colors.DARK};
`;

export const Description = styled.p`
  font-family: ${fonts.SECONDARY};
  font-size: 17px;
  margin: 0px;
  margin-bottom: 1em;
  color: ${colors.HIGHLIGHT};
  line-height: 1.1;
`;

export const Paragraph = styled.p`
  font-size: 17px;
  margin: 0px;
  color: #1e3d59;
  line-height: 1.3;
  margin-top: 1em;
`;

export const Inputs = styled.div`
  display: flex;
  width: 100%;
`;

export const Links = styled.div`
  width: 100%;
  margin-top: 2em;
  display: flex;
  flex-wrap: wrap;

  font-family: ${fonts.SECONDARY};
  & a {
    margin-right: 2em;
    margin-bottom: 1em;
    color: ${colors.HIGHLIGHT};
    text-decoration: none;
  }
`;

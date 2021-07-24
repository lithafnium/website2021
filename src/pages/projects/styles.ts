import { device } from "@app/shared/components/layout/layout";
import { colors, fonts } from "@app/styles/styles";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10em;
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

  & h1 {
    color: ${colors.DARK};
  }

  & p {
    font-size: 17px;
    color: ${colors.DARK};
  }

  & h3 {
    color: ${colors.DARK};
  }
`;

export const Project = styled.div`
  width: 100%;
`;

export const TechStack = styled.div`
  width: 100%;
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;

  font-family: ${fonts.SECONDARY};
  & p {
    margin: 0 2em 1em 0;
    color: ${colors.HIGHLIGHT};
    text-decoration: none;
  }
`;

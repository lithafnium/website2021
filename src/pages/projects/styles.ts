import { device, size } from "@app/shared/components/layout/layout";
import { colors, fonts, grayscale } from "@app/styles/styles";
import styled from "styled-components";

export const ContainerInner = styled.div`
  position: relative;
  max-width: ${size.tablet};
  width: 100%;
`;

export const Project = styled.div`
  width: 100%;
  margin-bottom: 1.5em;
`;

export const TechStack = styled.div`
  width: 100%;
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Label = styled.div`
  background-color: ${grayscale[50]};
  border-radius: 50px;
  padding: 4px 8px;
  & p {
    margin: 0px;
    text-decoration: none;
    font-size: 14px;
    line-height: 1rem;
    color: ${grayscale[800]};
  }
`;

export const ProjectHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & h3 {
    margin: 0px;
  }
`;

export const Bar = styled.div`
  width: 15px;
  height: 1px;
  background-color: ${grayscale[300]};
`;

export const ProjectLink = styled.a`
  color: ${grayscale[500]};
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
`;

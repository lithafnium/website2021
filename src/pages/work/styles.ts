import styled from "styled-components";
import { device, size } from "@app/shared/components/layout/layout";
import { colors, fonts, grayscale } from "@app/styles/styles";

export const ContainerInner = styled.div`
  position: relative;
  max-width: ${size.tablet};
  width: 100%;
  & h1 {
  }

  margin-top: 1em;
`;

export const WorkContainer = styled.div`
  position: relative;
  display: flex;
  gap: 1em;
  width: 100%;
  @media ${device.mobileS} {
    flex-direction: column;
  }
  @media ${device.tabletL} {
    flex-direction: row;
  }
`;

export const Tabs = styled.div`
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  @media ${device.mobileS} {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
    display: flex;
    overflow-x: scroll;
  }
  @media ${device.tabletL} {
    padding: 0px;
    margin: 0px;
    width: max-content;
    overflow-x: inherit;
    display: block;
  }
`;

export const Tab = styled.button<{
  active: boolean;
}>`
  height: 40px;

  @media ${device.mobileS} {
    border-bottom: 2px solid ${grayscale[300]};
    border-left: none;
    min-width: 150px;
    justify-content: center;
  }
  @media ${device.tabletL} {
    border-left: 2px solid ${grayscale[300]};
    border-bottom: none;
    width: 250px;
    justify-content: start;
  }

  padding: 0px 20px;

  text-decoration: none;
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;

  color: ${(props) => (props.active ? grayscale[900] : grayscale[300])};
  font-family: "Calibre", "Inter", "San Francisco", "SF Pro Text", -apple-system,
    system-ui, sans-serif;
  white-space: no-wrap;

  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    background-color: #eeeeee;
    cursor: pointer;
  }
`;

export const ActiveLine = styled.div<{
  index: any;
}>`
  @media ${device.mobileS} {
    width: 150px;
    margin-left: 25px;
    height: 2px;
    bottom: 0px;
    left: 0px;
    transform: translatex(calc(${(props) => props.index} * 150px));
  }
  @media ${device.tabletL} {
    width: 2px;
    margin: 0px;
    height: 40px;
    top: 0px;
    left: 0px;
    transform: translateY(calc(${(props) => props.index} * 40px));
  }

  position: absolute;

  background: ${grayscale[900]};

  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
`;

export const Content = styled.div`
  width: 100%;

  @media ${device.mobileS} {
    margin: 2em 0px;
    padding: 0px;
  }
  @media ${device.tabletL} {
    margin: 0;
  }
`;

export const Panel = styled.div`
  width: 100%;

  h3 {
    margin: 0px;
    font-weight: 550;
  }
`;

export const Date = styled.p`
  margin: 1em 0px;
  opacity: 0.7;
`;

export const List = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
  font-size: 17px;
`;

export const ListItem = styled.li`
  position: relative;
  padding-left: 30px;
  margin-bottom: 10px;
  opacity: 0.9;
  font-size: 16px;
  &:before {
    content: "▹";
    position: absolute;
    left: 0px;
  }
`;

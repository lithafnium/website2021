import styled from "styled-components";
import { device } from "@app/shared/components/layout/layout";
import { colors, fonts } from "@app/styles/styles";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20em;
`;

export const ContainerInner = styled.div`
  position: relative;
  max-width: 1024px;
  @media ${device.mobileS} {
    box-sizing: border-box;
    width: 80%;
  }

  @media ${device.laptopM} {
    padding: 0px 0px;
    width: 100%;
  }

  & h2 {
    color: ${colors.DARK};
  }
`;

export const WorkContainer = styled.div`
  position: relative;
  display: flex;
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
    display: flex;
    overflow-x: scroll;
  }
  @media ${device.tabletL} {
    width: max-content;
    overflow-x: inherit;
    display: block;
  }
`;

export const Tab = styled.button<{
  active: boolean;
}>`
  height: 55px;

  @media ${device.mobileS} {
    border-bottom: 2px solid #4d6e8c;
    border-left: none;
    min-width: 150px;
    justify-content: center;
  }
  @media ${device.tabletL} {
    border-left: 2px solid #4d6e8c;
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

  color: ${(props) => (props.active ? colors.HIGHLIGHT : colors.DARK)};
  font-family: ${fonts.SECONDARY};
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
    height: 2px;
    bottom: 0px;
    left: 0px;
    transform: translatex(calc(${(props) => props.index} * 150px));
  }
  @media ${device.tabletL} {
    width: 2px;
    height: 55px;
    top: 0px;
    left: 0px;
    transform: translateY(calc(${(props) => props.index} * 55px));
  }

  position: absolute;

  background: ${colors.HIGHLIGHT};

  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
`;

export const Content = styled.div`
  width: 100%;

  @media ${device.mobileS} {
    margin: 2em 0px;
    padding: 0px;
  }
  @media ${device.tabletL} {
    padding: 16px 5px;
    margin-left: 2em;
  }
`;

export const Panel = styled.div`
  width: 100%;

  h3 {
    margin: 0px;
    font-weight: 550;
    color: ${colors.DARK};
  }
`;

export const Date = styled.p`
  margin: 1em 0px;
  font-family: ${fonts.SECONDARY};
  color: ${colors.DARK};
  opacity: 0.7;
`;

export const List = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
  font-size: 18px;
`;

export const ListItem = styled.li`
  position: relative;
  padding-left: 30px;
  margin-bottom: 10px;
  color: ${colors.DARK};
  opacity: 0.9;
  line-height: 1.3;
  &:before {
    content: "▹";
    position: absolute;
    left: 0px;
    color: ${colors.HIGHLIGHT};
  }
`;

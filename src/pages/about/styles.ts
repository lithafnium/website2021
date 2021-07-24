import { device } from "@app/shared/components/layout/layout";
import { colors } from "@app/styles/styles";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5em;
`;

export const Heading = styled.div`
  position: relative;
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
`;

export const ContainerInner = styled.div`
  width: 100%;
  & h2 {
    margin-top: 0px;
    color: ${colors.DARK};
  }
  & p {
    color: ${colors.DARK};
    line-height: 1.4;
    font-size: 17px;
    opacity: 0.9;
  }
  @media ${device.mobileS} {
    display: block;
  }

  @media ${device.tabletL} {
    display: grid;
  }

  grid-template-columns: 2fr 3fr;
  gap: 50px;
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: rgba(2, 12, 27, 0.6) 0px 10px 30px -15px;
`;

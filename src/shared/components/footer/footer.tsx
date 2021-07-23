import React from "react";
import { ContainerInner, FooterContainer } from "./styles";

const Footer = () => {
  return (
    <FooterContainer>
      <ContainerInner>
        <h2>Zesti Dating</h2>
        <p>
          {" "}
          <span>&#169;</span> Zesti 2020
        </p>
      </ContainerInner>
    </FooterContainer>
  );
};

export default Footer;

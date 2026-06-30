import styled from "styled-components";
import { grayscale } from "@app/styles/styles";
import { size } from "@app/shared/components/layout/layout";

export const ContainerInner = styled.div`
  position: relative;
  max-width: ${size.tablet};
  width: 100%;
  & > p {
    font-size: 17px;
    color: ${grayscale[800]};
  }
`;

// A clickable card mirroring the Projects page cards.
export const PostCard = styled.div`
  width: 100%;
  margin-bottom: 1.5em;
  padding: 1.5em;
  box-sizing: border-box;
  border: 1px solid ${grayscale[200]};
  border-radius: 2px;
  transition: 0.2s;

  & h3 {
    margin: 0.2em 0 0 0;
  }

  & p {
    color: ${grayscale[700]};
    margin-bottom: 0px;
  }

  &:hover {
    cursor: pointer;
    border-color: ${grayscale[400]};
  }
`;

export const PostHeading = styled.div`
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

export const PostDate = styled.span`
  display: block;
  color: ${grayscale[500]};
  font-size: 14px;
`;

// ---- Post detail page ----

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
  @media (max-width: ${size.tablet}) {
    box-sizing: border-box;
    width: 80%;
  }
`;

export const Navbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  & h2 {
    &:hover {
      cursor: pointer;
    }
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

export const Article = styled.article`
  margin-top: 1.5em;
  color: ${grayscale[800]};
  line-height: 1.6;
  font-size: 17px;

  & h1 {
    color: ${grayscale[900]};
    margin-bottom: 0.2em;
  }
  & h2,
  & h3 {
    color: ${grayscale[900]};
    margin-top: 1.4em;
  }
  & a {
    color: ${grayscale[900]};
  }
  & img {
    max-width: 100%;
    border-radius: 5px;
  }
  & figure {
    margin: 1.5em 0;
    text-align: center;
  }
  & figure img {
    max-width: 300px;
    width: 100%;
  }
  & figcaption {
    margin-top: 0.6em;
    color: ${grayscale[500]};
    font-size: 14px;
    font-style: italic;
  }
  & pre {
    background: ${grayscale[50]};
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
  }
  & code {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 14px;
  }
  & pre code {
    background: none;
  }
  & table {
    border-collapse: collapse;
    width: 100%;
  }
  & th,
  & td {
    border: 1px solid ${grayscale[200]};
    padding: 6px 10px;
    text-align: left;
  }
  & blockquote {
    border-left: 3px solid ${grayscale[300]};
    margin-left: 0;
    padding-left: 1em;
    color: ${grayscale[600]};
  }
`;

export const PostMetaDate = styled.span`
  display: block;
  color: ${grayscale[400]};
  font-size: 14px;
  margin-bottom: 0.5em;
`;

export const PostTitle = styled.h1`
  color: ${grayscale[900]};
  margin: 0.4em 0 0.6em 0;
`;

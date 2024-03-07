import styled from "styled-components";

export const colors = {
  PRIMARY: "#FD8440",
  SECONDARY: "#3E533C",
  TERNARY: "#FFF6E9",
  DARK: "#1e3d59",
  HIGHLIGHT: "#17BEBB",
  // HIGHLIGHT: "#41B49D",
  // HIGHLIGHT: "#F46672",
};

export const grayscale = {
  "50": "rgb(243, 243, 243)",
  "100": "rgb(239, 239, 239)",
  "200": "rgb(223, 223, 223)",
  "300": "rgb(202, 202, 202)",
  "400": "rgb(168, 168, 168)",
  "500": "rgb(122, 122, 122)",
  "600": "rgb(88, 88, 88)",
  "700": "rgb(63, 63, 63)",
  "800": "rgb(43, 43, 43)",
  "900": "rgb(35, 35, 35)",
};

export const fonts = {
  PRIMARY: '"Calibre", "Inter", "San Francisco", "SF Pro Text", -apple-system,',
  SECONDARY: '"SF Mono","Fira Code","Fira Mono","Roboto Mono",monospace',
  // PRIMARY: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu;',
  // SECONDARY: "'Poppins', sans-serif",
};

export const Bold = styled.span`
  font-weight: 600;
  color: ${grayscale[900]};
  text-decoration: underline;
`;

export const Link = styled.a`
  text-decoration: none;
  color: ${grayscale[900]};
`;

import { css } from '@emotion/core';

export const fontFamily = [
  'Helvetica Neue',
  'Apple SD Gothic Neo',
  'arial',
  '"나눔고딕"',
  'Nanum Gothic',
  '"돋움"',
  'Dotum',
  'Tahoma',
  'Geneva',
  'sans-serif',
].join(', ');

export const cursorDefault = css`
  cursor: default;
`;

export const cursorPointer = css`
  cursor: pointer;
`;

export const inheritFont = css`
  color: inherit;
  letter-spacing: inherit;
  font-family: inherit;
`;

export const resetAppearance = css`
  appearance: none;
  background: none;
  box-shadow: none;
  border: 0;
`;

export const resetFont = css`
  color: black;
  font-family: ${fontFamily};
  font-weight: 400;
  letter-spacing: -0.03em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const resetLayout = css`
  padding: 0;
  margin: 0;
`;

export const reset = css`
  a {
    ${inheritFont};
    ${cursorPointer};

    &:link,
    &:visited {
      text-decoration: none;
    }
  }

  article {
    ${resetLayout};
  }

  aside {
    ${resetLayout};
  }

  body {
    ${resetLayout};
    ${cursorDefault};
  }

  button {
    ${cursorPointer};
    ${inheritFont};
    ${resetAppearance};
    ${resetLayout};
  }

  canvas {
    ${resetLayout};
  }

  dd {
    ${resetLayout};
  }

  details {
    ${resetLayout};
  }

  div {
    ${resetLayout};
  }

  dl {
    ${resetLayout};
  }

  dt {
    ${resetLayout};
  }

  fieldset {
    ${resetLayout};
  }

  figcaption {
    ${resetLayout};
  }

  figure {
    ${resetLayout};
  }

  footer {
    ${resetLayout};
  }

  form {
    ${resetLayout};
  }

  header {
    ${resetLayout};
  }

  hr {
    display: none;
  }

  html {
    ${resetFont};
    ${resetLayout};
    text-size-adjust: 100%;
  }

  h1 {
    ${resetLayout};
  }

  h2 {
    ${resetLayout};
  }

  h3 {
    ${resetLayout};
  }

  h4 {
    ${resetLayout};
  }

  h5 {
    ${resetLayout};
  }

  h6 {
    ${resetLayout};
  }

  iframe {
    ${resetLayout};
    display: block;
  }

  img {
    border: 0;
    -ms-interpolation-mode: bicubic;
  }

  input {
    ${inheritFont};
    ${resetAppearance};
    ${resetLayout};

    &::-ms-clear {
      display: none;
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  legend {
    ${resetLayout};
  }

  li {
    ${resetLayout};
  }

  nav {
    ${resetLayout};
  }

  ol {
    ${resetLayout};
    list-style: none;
  }

  p {
    ${resetLayout};
  }

  section {
    ${resetLayout};
  }

  select {
    ${inheritFont};
    ${resetAppearance};
    ${resetLayout};
  }

  summary {
    ${resetLayout};
  }

  table {
    ${resetLayout};
    border-collapse: collapse;
    border-spacing: 0;
  }

  td {
    ${resetLayout};
  }

  textarea {
    ${inheritFont};
    ${resetLayout};
  }

  th {
    ${resetLayout};
  }

  ul {
    ${resetLayout};
    list-style: none;
  }

  .a11y {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    border: 0;
    clip: rect(0, 0, 0, 0);
  }
`;

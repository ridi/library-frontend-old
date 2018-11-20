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

export const cursorDefault = {
  cursor: 'default',
};

export const cursorPointer = {
  cursor: 'pointer',
};

export const inheritFont = {
  color: 'inherit',
  letterSpacing: 'inherit',
  fontFamily: 'inherit',
};

export const resetAppearance = {
  appearance: 'none',
  background: 'none',
  boxShadow: 'none',
  border: 0,
};

export const resetFont = {
  color: 'black',
  fontFamily,
  fontWeight: 400,
  letterSpacing: '-.4px',
  '-webkit-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'grayscale',
};

export const resetHighlight = {
  outline: 'none',
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
};

export const resetLayout = {
  padding: 0,
  margin: 0,
};

export const globalReset = {
  a: [
    inheritFont,
    resetHighlight,
    cursorPointer,
    {
      '&:link, &:visited': {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
  ],
  article: [resetLayout],
  aside: [resetLayout],
  body: [
    resetLayout,
    cursorDefault,
    {
      background: '#f3f4f5',
    },
  ],
  button: [cursorPointer, inheritFont, resetAppearance, resetHighlight, resetLayout],
  canvas: [resetLayout],
  dd: [resetLayout],
  details: [resetLayout],
  div: [resetLayout],
  dl: [resetLayout],
  dt: [resetLayout],
  fieldset: [resetLayout],
  figcaption: [resetLayout],
  figure: [resetLayout],
  footer: [resetLayout],
  form: [resetLayout],
  header: [resetLayout],
  hr: { display: 'none' },
  html: [
    resetFont,
    resetLayout,
    {
      textSizeAdjust: '100%',
    },
  ],
  h1: [resetLayout],
  h2: [resetLayout],
  h3: [resetLayout],
  h4: [resetLayout],
  h5: [resetLayout],
  h6: [resetLayout],
  iframe: [resetLayout],
  img: {
    border: 0,
    '-ms-interpolation-mode': 'bicubic',
  },
  input: [inheritFont, resetAppearance, resetHighlight, resetLayout],
  legend: [resetLayout],
  li: [resetLayout],
  nav: [resetLayout],
  ol: [resetLayout, { listStyle: 'none' }],
  p: [resetLayout],
  section: [resetLayout],
  select: [inheritFont, resetAppearance, resetHighlight, resetLayout],
  summary: [resetLayout],
  table: [
    resetLayout,
    {
      borderCollapse: 'collapse',
      borderSpacing: 0,
    },
  ],
  td: [resetLayout],
  textarea: [inheritFont, resetLayout],
  th: [resetLayout],
  ul: [resetLayout, { listStyle: 'none' }],

  '.a11y': {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: 'hidden',
    border: 0,
    clip: 'rect(0, 0, 0, 0)',
  },
};

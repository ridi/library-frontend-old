export const authorFieldSeparator = {
  display: 'inline-block',
  position: 'relative',
  width: 9,
  height: 16,
  verticalAlign: 'top',
  '::after': {
    content: `''`,
    display: 'block',
    width: 1,
    height: 9,
    background: '#d1d5d9',
    position: 'absolute',
    left: 4,
    top: 3,
  },
};

export const preferenceMeta = {
  marginTop: 4,
  fontSize: 12,
  lineHeight: '1.3em',
  color: '#808991',
};

export const unreadDot = {
  display: 'inline-block',
  width: 4,
  height: 4,
  background: '#5abf0d',
  borderRadius: 4,
  verticalAlign: '12%',
  marginRight: 4,
};

export const seriesComplete = {
  background: '#b3b3b3',
  borderRadius: 2,
  marginLeft: 4,

  padding: '0px 2px 0 1px',
  boxSizing: 'border-box',
};

export const seriesCompleteIcon = {
  fill: 'white',
  width: 16,
  height: 8,
};

export const button = {
  display: 'block',
  width: 68,
  lineHeight: '30px',
  borderRadius: 4,
  border: '1px solod #0077d9',
  boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
  backgroundColor: '#1f8ce6',
  fontSize: 12,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
  zIndex: 10,
};

export const buttonsWrapper = {
  '.LandscapeBook_Buttons': {
    zIndex: 10,
  },
};

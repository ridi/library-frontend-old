const buttonHeight = 30;
const wrapperStyle = {
  display: 'inline-block',
  listStyle: 'none',
  padding: 0,
  border: '1px solid #d1d5d9',
  overflow: 'hidden',
  borderRadius: '3px',
  boxShadow: '0 1px 1px 0 rgba(206, 210, 214, 0.3)',
  verticalAlign: 'top',
};

export const paginator = {
  boxSizing: 'border-box',
  width: '100%',
  paddingBottom: 25,
  textAlign: 'center',
  whiteSpace: 'nowrap',
};

export const pageItems = {
  ...wrapperStyle,
  margin: '0 3px',
};

export const buttonWrapper = {
  ...wrapperStyle,
};

export const pageItem = {
  display: 'inline-block',
  marginLeft: -1,
  borderLeft: '1px solid #d1d5d9',
  verticalAlign: 'top',
};

export const pageButton = {
  display: 'block',
  minWidth: 36,
  height: buttonHeight,
  lineHeight: `${buttonHeight}px`,
  textAlign: 'center',
  fontSize: 13,
  color: '#808991',
  background: '#FFF',
};

export const textButton = {
  width: 44,
  fontSize: 12,
  fontWeight: '700',
};

export const pageButtonActive = {
  background: '#808991',
  color: 'white',
  fontWeight: '700',
  lineHeight: `${buttonHeight - 2}px`,
};

export const pageItemIcon = {
  width: 6,
  height: 9,
  fill: '#818a92',
};

export const paginatorDots = {
  display: 'inline-block',
  width: 8,
  height: buttonHeight + 2,
  lineHeight: `${buttonHeight - 2}px`,
  padding: '0 3px',
};

export const dots = {
  width: '100%',
  verticalAlign: 'middle',
  fill: '#bfc4c8',
};

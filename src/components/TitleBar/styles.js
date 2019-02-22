export const titleBar = {
  backgroundColor: 'white',
};

export const title = {
  display: 'flex',
  alignItems: 'center',
  height: 46,
  width: '100%',
};

export const backButton = {
  display: 'block',
  padding: '13px 10px 13px 0',
  fill: '#40474d',
};

export const backIcon = {
  width: 16,
  height: 16,
};

const titleHeight = 30;

export const titleTextWrapper = {
  height: titleHeight,
  width: '100%',
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  paddingBottom: 3,
};

export const titleText = {
  fontSize: 16,
  fontWeight: 700,
  color: '#40474d',
  height: titleHeight,
  lineHeight: `${titleHeight}px`,

  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
  overflow: 'hidden',
};

export const count = {
  paddingLeft: 6,
  fontSize: 15,
  fontWeight: 400,
  height: titleHeight - 1,
  lineHeight: `${titleHeight - 1}px`,
  color: '#808991',
};

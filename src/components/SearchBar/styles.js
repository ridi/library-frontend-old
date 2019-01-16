export const searchBoxWrapper = {
  flex: 1,
  maxWidth: 600,
  transition: 'max-width .3s',
  '.hideTools & ': {
    maxWidth: 1000,
  },
};

export const toolsWrapper = {
  height: 24,
  paddingLeft: 2,
  maxWidth: 600,
  opacity: 1,
  transition: 'max-width .3s, opacity .3s',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '.hideTools & ': {
    maxWidth: 0,
    opacity: 0,
  },
};

export const searchBox = {
  position: 'relative',
  width: '100%',
  height: 30,
  paddingLeft: 28,
  paddingRight: 16,
  borderRadius: 3,
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5d9',
  boxSizing: 'border-box',
};

export const searchBoxActive = {
  paddingRight: 38,
};

export const searchBoxIcon = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 12,
  height: 12,
  padding: 9,
  '.RSGIcon': {
    width: 12,
    height: 12,
  },
};

export const searchBoxInput = {
  width: '100%',
  height: '100%',
  fontSize: 13,
  letterSpacing: -0.7,
  color: '#40474d',
};

export const searchBoxClearButton = {
  display: 'none',
  position: 'absolute',
  top: '50%',
  right: 0,
  width: 30,
  height: 30,
  transform: 'translate3d(0, -50%, 0)',
  '&::after, .RSGIcon': {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
  },
  '&::after': {
    content: `''`,
    borderRadius: '50%',
    display: 'block',
    width: 14,
    height: 14,
    background: '#9ea7ad',
  },
  '.RSGIcon': {
    width: 6,
    height: 6,
    fill: 'white',
    zIndex: 100,
  },
};

export const searchBoxClearButtonActive = {
  display: 'block',
};

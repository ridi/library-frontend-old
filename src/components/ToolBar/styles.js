export const toolBar = {
  backgroundColor: '#f3f4f5',
  borderBottom: '1px solid #d1d5d9',
  boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .04)',
};

export const flexWrapper = {
  display: 'flex',
  height: 44,
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const toolBarSearchBarWrapper = {
  flex: 1,
  maxWidth: 600,
  transition: 'max-width .3s',
  '.hideTools & ': {
    maxWidth: 1000,
  },
};

const buttonSize = 24;

export const toolBarToolsWrapper = {
  height: buttonSize,
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

export const toolBarIconButton = {
  width: buttonSize,
  height: buttonSize,
  position: 'relative',
  marginLeft: 16,
};

export const iconBaseLayout = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
};

export const categoryFilterIcon = Object.assign({}, iconBaseLayout, {
  width: 18,
  height: 12,
});

export const editIcon = Object.assign({}, iconBaseLayout, {
  width: 20,
  height: 20,
});

export const threeDotsIcon = Object.assign({}, iconBaseLayout, {
  width: 4,
  height: 16,
});

export const mainButtonActionLeft = {
  float: 'left',
};

export const mainButtonActionRight = {
  float: 'right',
};

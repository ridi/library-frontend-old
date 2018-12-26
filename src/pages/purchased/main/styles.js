export const mainToolBar = {
  display: 'flex',
  height: 44,
  alignItems: 'center',
  backgroundColor: '#f3f4f5',
  borderBottom: '1px solid #d1d5d9',
};

export const mainToolBarSearchBarWrapper = {
  flex: 1,
  maxWidth: 600,
};

export const mainToolBarSearchBarWrapperActive = {
  maxWidth: 1000,
};

const buttonSize = 24;

export const mainToolBarToolsWrapper = {
  height: buttonSize,
  paddingLeft: 2,
};

export const mainToolBarIconButton = {
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

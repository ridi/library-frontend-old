const buttonSize = 24;

const defaultStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
};

export const iconButton = {
  width: buttonSize,
  height: buttonSize,
  position: 'relative',
  marginLeft: 16,
};

export const categoryFilterIcon = Object.assign({}, defaultStyle, {
  width: 18,
  height: 12,
});

export const editIcon = Object.assign({}, defaultStyle, {
  width: 20,
  height: 20,
});

export const threeDotsIcon = Object.assign({}, defaultStyle, {
  width: 4,
  height: 16,
});

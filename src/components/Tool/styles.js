const buttonSize = 24;

const defaultStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
};

export const buttonWrapper = {
  position: 'relative',
  marginLeft: 12,
};

export const iconButton = isActive => ({
  position: 'relative',
  padding: '2px 3px',
  borderRadius: 3,
  whiteSpace: 'nowrap',
  background: isActive ? '#e6e8eb' : null,
  fill: '#40474d',
  ':hover': {
    background: '#e6e8eb',
  },
});

export const iconWrapper = {
  width: buttonSize,
  height: buttonSize,
  display: 'inline-block',
  position: 'relative',
};

export const categoryFilterIcon = {
  ...defaultStyle,
  width: 18,
  height: 12,
};

export const editIcon = {
  ...defaultStyle,
  width: 20,
  height: 20,
};

export const threeDotsIcon = {
  ...defaultStyle,
  width: 4,
  height: 16,
};

export const onIcon = {
  ...defaultStyle,
  width: 24,
  height: 16,
  marginRignt: 2,
  fill: '#008deb',
};

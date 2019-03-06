export const Align = {
  Left: 'left',
  Right: 'right',
};

const arrowIcon = horizontalAlign => ({
  '&::after': {
    content: `''`,
    display: 'block',
    width: 0,
    height: 0,

    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '7px solid #1f8ce6',

    position: 'absolute',
    [horizontalAlign]: 10,
    top: -7,
  },
});

export const tooltip = (isActive, horizontalAlign = Align.Right) => {
  const active = isActive
    ? {
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
        pointerEvents: 'auto',
      }
    : {};
  return {
    display: 'block',
    position: 'absolute',
    [horizontalAlign]: -1,
    top: 35,
    zIndex: 9000,
    background: '#1f8ce6',
    borderRadius: 4,
    padding: '12px 33px 12px 12px',
    color: 'white',
    fontSize: '13px',
    lineHeight: '13px',
    whiteSpace: 'nowrap',

    opacity: 0,
    transform: 'translate3d(0, 20px, 0)',
    pointerEvents: 'none',
    ...active,
    ...arrowIcon(horizontalAlign),
  };
};

export const checkIconWrapper = {
  position: 'absolute',
  right: 12,
  top: '50%',
  marginTop: '-9px',
  borderRadius: '50%',
  boxSizing: 'border-box',
  border: '1px solid rgba(0, 98, 179, 0.5)',
  background: '#0077d9',
  width: 18,
  height: 18,
};

export const checkIcon = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  width: 8,
  height: 8,
  fill: 'white',
};

export const tooltipBackground = isActive => {
  const active = isActive ? { pointerEvents: 'initial', zIndex: 9999 } : {};

  return {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: -9999,
    ...active,
  };
};

export const transparentCloseButtonContainer = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

export const transparentCloseButton = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
};

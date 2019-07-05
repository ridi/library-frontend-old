import { Hoverable } from '../../styles/responsive';

import graySpinner from '../../static/spinner/gray_spinner.gif';

export const Align = {
  Left: 'left',
  Right: 'right',
};

const customScrollBar = {
  '::-webkit-scrollbar': {
    width: 12,
  },
  '::-webkit-scrollbar-thumb': {
    border: '4px solid rgba(0, 0, 0, 0)',
    borderRadius: '12px',
    background: '#d1d5d9',
    backgroundClip: 'padding-box',
  },
};

export const modal = (isActive, horizontalAlign = Align.Right) => {
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
    minWidth: 200,
    maxHeight: 450,
    [horizontalAlign]: -6,
    top: 30,
    zIndex: 9999,
    background: 'rgba(255, 255, 255, .98)',
    borderRadius: 4,
    boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.05)',
    opacity: 0,
    transform: 'translate3d(0, 20px, 0)',
    pointerEvents: 'none',
    overflowX: 'hidden',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    ...customScrollBar,
    ...active,
  };
};

export const itemGroup = {
  padding: '4px 0',
  borderTop: `1px solid #e6e8eb`,
  '&:first-of-type': {
    borderTop: 0,
  },
};

export const groupTitle = {
  width: '100%',
  boxSizing: 'border-box',
  lineHeight: '16px',
  fontSize: 13,
  color: '#808991',
  padding: '10px 14px 2px 14px',
};

export const item = {
  display: 'block',
  position: 'relative',
  minWidth: 200,
  boxSizing: 'border-box',
  padding: '11px 11px 10px 42px',
  fontSize: 15,
  color: '#40474d',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  ...Hoverable({
    backgroundColor: '#f3f4f5',
  }),
};

export const spinner = showSpinner =>
  showSpinner
    ? {
        '::after': {
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
          content: `''`,
          background: `url(${graySpinner}) center no-repeat`,
          backgroundColor: 'rgba(255, 255, 255, .9)',
          backgroundSize: '22px 22px',
          width: '100%',
          height: '100%',
          cursor: 'default',
        },
      }
    : {};

export const icon = {
  position: 'absolute',
  width: 18,
  height: 18,
  left: 14,
  top: '50%',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#9ea7ad',
};

export const selectedIcon = {
  ...icon,
  fill: '#339cf2',
};

export const count = {
  marginLeft: 4,
  fontSize: 13,
  letterSpacing: -0.3,
  color: '#808991',
};

export const modalBackground = isActive => {
  const active = isActive ? { pointerEvents: 'initial', zIndex: 9000 } : {};

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

export const filterModalStyle = {
  childPathWrapper: {
    display: 'inline-block',
    position: 'relative',
    paddingLeft: 20,
  },
  childPathIcon: {
    display: 'block',
    position: 'absolute',
    left: 4,
    top: 4,
    width: 7,
    height: 7,
    borderLeft: '1px solid #808991',
    borderBottom: '1px solid #808991',
  },
};

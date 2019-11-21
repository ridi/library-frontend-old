import { css, keyframes } from '@emotion/core';

import { Hoverable } from '../../styles/responsive';

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
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  padding: '10px',
  minWidth: 200,
  fontSize: 15,
  lineHeight: '20px',
  color: '#40474d',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  ...Hoverable({
    backgroundColor: '#f3f4f5',
  }),
  '&:disabled': {
    opacity: 0.4,
  },
};

export const icon = {
  width: 24,
  height: 24,
  margin: 0,
  marginRight: 8,
  fill: '#9ea7ad',
};

export const selectedIcon = {
  fill: '#339cf2',
};

const iconSpinKeyframes = keyframes`
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(1turn);
  }
`;

export const iconSpinning = css`
  animation: ${iconSpinKeyframes} 2s linear infinite;
`;

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

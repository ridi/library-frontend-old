import { ButtonType } from './constants';

export const ACTION_BAR_HEIGHT = 51;

export const actionBarFixedWrapper = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 8000,
  backgroundColor: '#f7f9fa',
  boxShadow: '0 -2px 10px 0 rgba(0, 0, 0, 0.04)',
  borderTop: '1px solid #d1d5d9',
};

export const actionBar = {
  display: 'flex',
  height: `${ACTION_BAR_HEIGHT - 1}px`,
};

export const actionButton = disable => {
  const disabledStyle = disable
    ? {
        opacity: '0.4',
      }
    : {};
  return {
    fontSize: 15,
    lineHeight: '1.2em',
    textAlign: 'center',
    height: 50,
    padding: '0 8px',
    ...disabledStyle,
    '&:first-of-type': {
      paddingLeft: 0,
    },
    '&:last-of-type': {
      paddingRight: 0,
    },
  };
};

export const actionButtonType = type => {
  switch (type) {
    case ButtonType.DANGER:
      return {
        color: '#e64938',
      };
    case ButtonType.SPACER:
      return {
        flex: '1',
      };
    case ButtonType.NORMAL:
    default:
      return {
        color: '#1f8ce6',
      };
  }
};

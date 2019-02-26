import { css } from '@emotion/core';
import { reset } from '../../styles';

export const bodyStyle = {
  body: {
    position: 'relative',
    minWidth: 320,
    minHeight: '100vh',
    boxSizing: 'border-box',
    background: 'white',

    '&.focus-free *': {
      outline: 'none',
      WebkitTapHighlightColor: 'transparent',
    },
    '&.disable-scroll': {
      overflow: 'hidden',
    },

    '&::after': {
      content: `''`,
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: -1,
      width: '100%',
      height: '100%',
      background: '#f3f4f5',
    },
  },
};

export const globalStyles = css([reset, bodyStyle]);

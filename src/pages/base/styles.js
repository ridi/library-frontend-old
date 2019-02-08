import { css } from '@emotion/core';
import { PAGINATOR_HEIGHT } from '../../components/Paginator/styles';
import { reset } from '../../styles';

export const bodyStyle = {
  body: {
    paddingBottom: PAGINATOR_HEIGHT,
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
      overflow: 'hidde',
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

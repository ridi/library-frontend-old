import { css } from '@emotion/core';

import { reset } from '../../styles';

const libraryBodyStyles = css`
  body {
    position: relative;
    min-width: 320px;
    min-height: 100vh;
    box-sizing: border-box;
    background: white;

    &.focus-free * {
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    &.disable-scroll {
      overflow: hidden;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background: #f3f4f5;
    }
  }
`;

export const globalStyles = css([reset, libraryBodyStyles]);

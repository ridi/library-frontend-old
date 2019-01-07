import { css } from '@emotion/core';
import { MAX_WIDTH } from './constants';

export const Hidden = css({
  fontSize: 0,
  width: 0,
  height: 0,
  color: 'transparent',
  overflow: 'none',
});

export const maxWidthWrapper = {
  maxWidth: MAX_WIDTH,
  margin: '0 auto',
};

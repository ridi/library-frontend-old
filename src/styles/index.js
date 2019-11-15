import { css } from '@emotion/core';

import { FULL_MAX_WIDTH, XLARGE_MAX_WIDTH, XXLARGE_MAX_WIDTH } from './constants';
import { Responsive } from './responsive';

export * from './reset';

export const Hidden = css({
  fontSize: 0,
  width: 0,
  height: 0,
  color: 'transparent',
  overflow: 'none',
});

export const maxWidthWrapper = {
  ...Responsive.XLarge({
    maxWidth: XLARGE_MAX_WIDTH,
  }),
  ...Responsive.XXLarge({
    maxWidth: XXLARGE_MAX_WIDTH,
  }),
  ...Responsive.Full({
    maxWidth: FULL_MAX_WIDTH,
  }),
};

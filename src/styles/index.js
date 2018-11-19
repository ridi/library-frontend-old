import { css, injectGlobal } from 'emotion';
import { globalReset } from './reset';

injectGlobal(globalReset);

export const LAYOUT_BREAK_POINT = 833;

export const hidden = css({
  fontSize: 0,
  width: 0,
  height: 0,
  color: 'transparent',
  overflow: 'none',
});

export const media = {
  isMobile: cls => ({
    [`@media (max-width: ${LAYOUT_BREAK_POINT}px)`]: {
      ...cls,
    },
  }),
  isPc: cls => ({
    [`@media (min-width: ${LAYOUT_BREAK_POINT + 1}px)`]: {
      ...cls,
    },
  }),
};

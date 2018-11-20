import { css, injectGlobal } from 'emotion';
import { globalReset } from './reset';

export const FOOTER_HEIGHT = 254;
export const LAYOUT_BREAK_POINT = 833;
export const PAGE_MAX_WIDTH = 1000;

injectGlobal(globalReset);

export const hidden = css({
  fontSize: 0,
  width: 0,
  height: 0,
  color: 'transparent',
  overflow: 'none',
});

export const screenSize = {
  isMobile: styles => ({
    [`@media (max-width: ${LAYOUT_BREAK_POINT}px)`]: {
      ...styles,
    },
  }),
  isPc: styles => ({
    [`@media (min-width: ${LAYOUT_BREAK_POINT + 1}px)`]: {
      ...styles,
    },
  }),
};

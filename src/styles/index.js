import { css } from 'emotion';

export const LAYOUT_BREAK_POINT = 833;
export const PAGE_MAX_WIDTH = 1000;

export const Hidden = css({
  fontSize: 0,
  width: 0,
  height: 0,
  color: 'transparent',
  overflow: 'none',
});

export const maxWidthWrapper = {
  maxWidth: PAGE_MAX_WIDTH,
  margin: '0 auto',
};

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

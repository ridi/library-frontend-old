import { css } from '@emotion/core';

export * from './reset';

export const BOOK_LIST_LAYOUT_BREAK_POINT = 600;
export const PAGE_LAYOUT_BREAK_POINT = 833;
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

// https://app.asana.com/0/search/920785676324447/879981298827203
export const bookListLayout = {
  isResponsive: styles => ({
    [`@media (max-width: ${BOOK_LIST_LAYOUT_BREAK_POINT - 1}px)`]: {
      ...styles,
    },
  }),
  isFixed: styles => ({
    [`@media (min-width: ${BOOK_LIST_LAYOUT_BREAK_POINT}px)`]: {
      ...styles,
    },
  }),
};

export const screenSize = {
  isMobile: styles => ({
    [`@media (max-width: ${PAGE_LAYOUT_BREAK_POINT}px)`]: {
      ...styles,
    },
  }),
  isPc: styles => ({
    [`@media (min-width: ${PAGE_LAYOUT_BREAK_POINT + 1}px)`]: {
      ...styles,
    },
  }),
};

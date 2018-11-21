import { css } from 'emotion';

export const MainToolBarWrapper = css({
  height: 46,
  backgroundColor: '#f3f4f5',
  boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
  boxSizing: 'border-box',
  borderBottom: '1px solid #d1d5d9',
});
export const MainToolBar = css({
  padding: '8px 14px',
});

export const MainToolBarSearchBarWrapper = css({
  float: 'left',
  padding: '8px 0',
  height: 30,
});
export const MainToolBarToolsWrapper = css({
  float: 'right',
  height: 30,
  padding: '8px 2px 8px 18px',
});

export const MainToolBarIcon = css({
  margin: '3px 0',
  marginRight: 16,
  width: 24,
  height: 24,

  '.RSGIcon': {
    width: 24,
    height: 24,
  },
});

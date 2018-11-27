import { css } from 'emotion';

export const MenuGroup = css({
  width: '100%',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e6e8eb',
});

export const MenuGroupTitle = css({
  width: '100%',
  height: 16,

  fontSize: 13,
  letterSpacing: -0.1,
  color: '#808991',
  padding: '16px 14px 8px 14px',
});

export const MenuGroupList = css({
  width: '100%',
});

export const MenuGroupItemWrapper = css({
  width: '100%',
  height: 40,
});

export const MenuGroupItem = css({
  width: '100%',
  height: '100%',

  position: 'relative',
  padding: '11px 11px 10px 42px',

  textAlign: 'left',
});

export const MenuGroupItemTitle = css({
  fontSize: 15,
  letterSpacing: -0.3,
  color: '#40474d',
});

export const MenuGroupItemIcon = css({
  position: 'absolute',
  width: 20,
  height: 20,
  left: 14,
  top: '50%',
  webkitTransform: 'translate3d(0, -50%, 0)',
  msTransform: 'translate3d(0, -50%, 0)',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#9ea7ad',
});

import { css } from 'emotion';

export const EditingBarWrapper = css({
  width: '100%',
  height: 46,
  backgroundColor: '#0077d9',
  boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
});

export const EditingBar = css({
  padding: '8px 16px',
  height: 30,
});

export const EditingBarIconWrapper = css({
  height: 30,
  paddingLeft: 36,
  float: 'left',
  position: 'relative',
});

export const EditingBarIcon = css({
  position: 'absolute',
  width: 12,
  height: 9,
  top: '50%',
  left: 12,
  webkitTransform: 'translate3d(0, -50%, 0)',
  msTransform: 'translate3d(0, -50%, 0)',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#ffffff',
});
export const EditingBarSelectCount = css({
  height: 20,
  padding: '5px 0',
  fontSize: 15,
  letterSpacing: '-0.3',
  color: '#ffffff',
  lineHeight: '20px',
});
export const EditingBarAllSelect = css({
  marginRight: 16,
  fontSize: 15,
  letterSpacing: '-0.3',
  color: '#ffffff',
});
export const EditingBarCompleteButton = css({
  width: 52,
  height: 30,
  padding: '7px 0',
  borderRadius: 4,
  backgroundColor: '#ffffff',
  boxShadow: '1px 1px 1px 0 rgba(0, 0, 0, 0.05)',
  border: '1px solid #d1d5d9',
  boxSizing: 'border-box',

  fontSize: '13',
  fontWeight: 'bold',
  letterSpacing: '-0.3',
  textAlign: 'center',
  color: '#0077d9',
});

export const floatRight = css({
  float: 'right',
});

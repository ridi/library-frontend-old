import { css } from 'emotion';

export const LNBTabBarWrapper = css({
  height: 40,
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #d1d5d9',
});

export const LNBTitleBarWrapper = css({
  height: 46,
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
  boxSizing: 'border-box',
  borderBottom: '1px solid #d1d5d9',
});

export const LNBTitleBar = css({
  display: 'flex',
  alignItems: 'center',
  height: 46,
});

export const LNBTitleBarBackIconWrapper = css({
  padding: '5px 10px 5px 0',
  height: 20,
});
export const LNBTitleBarBackIcon = css({
  width: 20,
  height: 20,
  '.RSGIcon': {
    width: 16,
    height: 16,
  },
});

export const LNBTitleBarTitleWrapper = css({
  height: 30,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
});
export const LNBTitleBarTitle = css({
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: -0.3,
  color: '#40474d',
});

export const LNBHiddenTitleBarHiddenCount = css({
  paddingLeft: 6,
  fontSize: 15,
  fontweight: 'bold',
  letterSpacing: -0.3,
  color: '#808991',
});

export const LNBHiddenTitleBarToolsWrapper = css({});
export const LNBHiddenTitleBarTool = css({
  margin: '3px 0',
  width: 24,
  height: 24,
  marginRight: 16,
  '&:last-of-type': {
    marginRight: 0,
  },
  '.RSGIcon': {
    width: 20,
    height: 20,
    fill: '#40474d',
  },
});

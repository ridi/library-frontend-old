import { css } from 'emotion';

export const TabBar = css`
  list-style: none,
  margin: 0,
  padding: 0,
  width: 100%,
  height: 40px,
`;

export const TabItem = css({
  float: 'left',
  height: '100%',

  marginLeft: 8,
  '&:first-of-type': {
    marginLeft: 0,
  },
  '& button': {
    color: '#808991',
    fontSize: 16,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
});

export const TabItemActive = css({
  '& button': {
    color: '#40474d',
    fontWeight: 'bolder',
    borderBottom: '3px solid #9ea7ad',
  },
});

export const TabButton = css({
  padding: 8,
  height: '100%',
  boxSizing: 'border-box',
  border: 0,
});

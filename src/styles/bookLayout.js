import { css } from '@emotion/core';
import { Responsive } from './responsive';

// https://app.asana.com/0/search/920785676324447/879981298827203
export const bookListStyle = css({
  ...Responsive.W360({
    width: 360,
  }),
  ...Responsive.W600({
    width: 600,
  }),
  ...Responsive.W834({
    width: 834,
  }),
  ...Responsive.W1280({
    width: 1000,
  }),
});

export const portraitBookListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'left',
  paddingBottom: 26,
  margin: '0 auto',
  boxSizing: 'border-box',

  ...Responsive.W360({
    padding: '0 16px',
  }),
  ...Responsive.W600({
    padding: '0 35px',
  }),
  ...Responsive.W834({
    padding: '0 65px',
  }),
  ...Responsive.W1280({
    padding: '0 20px',
  }),
});

export const landscapeBookListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'left',
  paddingBottom: 26,
  margin: '0 auto',
  boxSizing: 'border-box',
});

export const portraitBookWrapperStyle = css({
  marginTop: 32,
  boxSizing: 'border-box',

  ...Responsive.W360({
    width: 114,
    height: 'inherit',
    paddingRight: 16,

    '&:nth-of-type(3n)': {
      paddingRight: 0,
      width: 98,
    },
  }),
  ...Responsive.W600({
    width: 140,
    height: 170,
    paddingRight: 30,

    '&:nth-of-type(4n)': {
      paddingRight: 0,
      width: 110,
    },
  }),
  ...Responsive.W834({
    width: 140,
    height: 170,
    paddingRight: 30,

    '&:nth-of-type(5n)': {
      paddingRight: 0,
      width: 110,
    },
  }),
  ...Responsive.W1280({
    width: 170,
    height: 170,
    paddingRight: 60,

    '&:nth-of-type(6n)': {
      paddingRight: 0,
      width: 110,
    },
  }),
});

export const landscapeBookWrapperStyle = css({
  boxSizing: 'border-box',
  width: '100%',

  ...Responsive.W360({
    padding: '0 24px',
  }),
  ...Responsive.W600({
    padding: '0 35px',
  }),
  ...Responsive.W834({
    width: '50%',
    padding: '0 41px',
  }),
  ...Responsive.W1280({
    width: '50%',
    padding: '0 24px',
  }),
});

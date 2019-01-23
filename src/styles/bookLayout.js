import { css } from '@emotion/core';
import { Responsive } from './responsive';

// https://app.asana.com/0/search/920785676324447/879981298827203
export const bookListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'left',
  paddingBottom: 26,
  margin: '0 auto',
  boxSizing: 'border-box',

  ...Responsive.W360({
    width: 326,
  }),
  ...Responsive.W600({
    width: 530,
  }),
  ...Responsive.W834({
    width: 670,
  }),
  ...Responsive.W1280({
    width: 960,
  }),
});

export const portraitBookWrapperStyle = css({
  marginTop: 32,

  ...Responsive.W360({
    width: 114,
    height: 'inherit',
    paddingRight: 16,
    boxSizing: 'border-box',

    '&:nth-of-type(3n)': {
      paddingRight: 0,
      width: 98,
    },
  }),
  ...Responsive.W600({
    width: 140,
    height: 170,
    paddingRight: 30,
    boxSizing: 'border-box',

    '&:nth-of-type(4n)': {
      paddingRight: 0,
      width: 110,
    },
  }),
  ...Responsive.W834({
    width: 140,
    height: 170,
    paddingRight: 30,
    boxSizing: 'border-box',

    '&:nth-of-type(5n)': {
      paddingRight: 0,
      width: 110,
    },
  }),
  ...Responsive.W1280({
    width: 170,
    height: 170,
    paddingRight: 60,
    boxSizing: 'border-box',

    '&:nth-of-type(6n)': {
      paddingRight: 0,
      width: 110,
    },
  }),
});

export const landscapeBookWrapperStyle = css({
  width: '50%',

  ...Responsive.Mobile({
    width: '100%',
  }),
});

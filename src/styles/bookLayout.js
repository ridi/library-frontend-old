import { css } from '@emotion/core';
import { Responsive } from './responsive';

// https://app.asana.com/0/search/920785676324447/879981298827203
export const bookListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'center',

  ...Responsive.W360({
    padding: '0 8px',
  }),
  ...Responsive.W600({
    padding: '0 20px',
  }),
  ...Responsive.W834({
    padding: '0 67px',
  }),
  ...Responsive.W1280({
    padding: '0 130px',
  }),
});

export const bookWrapperStyle = css({
  ...Responsive.W360({
    width: '33%',
    height: 'inherit',
    padding: '0 8px',
    boxSizing: 'border-box',
  }),
  ...Responsive.W600({
    width: 140,
    height: 170,
    padding: '0 15px',
    boxSizing: 'border-box',
  }),
  ...Responsive.W834({
    width: 140,
    height: 170,
    padding: '0 15px',
    boxSizing: 'border-box',
  }),
  ...Responsive.W1280({
    width: 170,
    height: 170,
    padding: '0 30px',
    boxSizing: 'border-box',
  }),
});

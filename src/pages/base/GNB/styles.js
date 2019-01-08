import { css } from '@emotion/core';
import { maxWidthWrapper } from '../../../styles';
import { Responsive } from '../../../styles/responsive';

export const GNB = css([
  Responsive.Mobile({
    padding: '2px 0',
  }),
  { background: 'white', borderBottom: '1px solid #f2f4f5' },
]);

export const flexWrapper = css({
  display: 'flex',
  justifyContent: 'space-between',
  ...maxWidthWrapper,
});

export const title = css({
  display: 'inline-block',
  padding: '12px 6px 12px 0',
  fontSize: 20,
  fontWeight: 900,
  color: '#212529',
  height: 24,
  lineHeight: '22px',
  verticalAlign: 'top',
});

export const titleLink = css({});

export const familyServiceList = css({
  display: 'inline-block',
  padding: '12px 0 14px 0',
  verticalAlign: 'top',
});

export const familyServiceItem = css({
  position: 'relative',
  display: 'inline-block',
  fontSize: 0,
  padding: '0 2px',
  '&:first-of-type': {
    padding: '0 3px 0 0',
  },
  '&::before': {
    content: `''`,
    display: 'block',
    width: 1,
    height: 7,
    background: '#d1d5d9',
    position: 'absolute',
    left: -1,
    top: '50%',
    transform: 'translate3d(0, -50%, 0)',
  },
  '&:first-of-type::before': {
    display: 'none',
  },
});

export const familyServiceLink = css({
  display: 'inline-block',
  padding: 6,
});

export const ridibooksIcon = css({
  width: 65,
  height: 10,
  fill: '#b8bfc4',
});

export const ridiSelectIcon = css({
  width: 62,
  height: 10,
  fill: '#b8bfc4',
});

export const myMenuWrapper = css({
  padding: '7px 0',
});

export const myMenuToggleButton = css({
  padding: '6px 0',
});

export const myMenuIcon = isActive =>
  css([
    {
      width: 20,
      height: 20,
      fill: '#808991',
      transformOrigin: 'center center',
      transform: 'rotate(0)',
      transition: 'transform .3s',
    },
    isActive && {
      transform: 'rotate(180deg)',
    },
  ]);

import { css } from '@emotion/core';
import { maxWidthWrapper } from '../../../styles';
import { MQ, Responsive } from '../../../styles/responsive';

export const GNB = {
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large], {
    padding: '2px 0',
  }),
  background: 'white',
};

export const flexWrapper = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 auto',
  alignItems: 'center',
  ...maxWidthWrapper,
};

export const title = {
  display: 'inline-block',
  padding: '12px 6px 12px 0',
  fontSize: 20,
  fontWeight: 900,
  color: '#212529',
  height: 24,
  lineHeight: '22px',
  verticalAlign: 'top',
};

export const titleLink = {};

export const familyServiceList = {
  display: 'inline-block',
  padding: '12px 0 14px 0',
  verticalAlign: 'top',
};

export const familyServiceItem = {
  position: 'relative',
  display: 'inline-block',
  fontSize: 0,
  padding: '0 3px 0 0',
};

export const familyServiceItemSeparator = {
  padding: '0 2px',
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
};

export const familyServiceLink = {
  display: 'inline-block',
  padding: 6,
};

export const ridibooksIcon = {
  width: 65,
  height: 10,
  fill: '#b8bfc4',
};

export const ridiSelectIcon = {
  width: 62,
  height: 10,
  fill: '#b8bfc4',
};

export const myMenuWrapper = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  padding: '7px 0',
};

export const BetaBadge = {
  width: 27,
  height: 12,
  fill: '#808991',
};

export const myMenuToggleButton = {
  padding: '6px 0',
  marginLeft: 3,
};

export const myMenuIcon = {
  width: 24,
  height: 24,
  fill: '#808991',
};

export const myMenuActiveIcon = {
  ...myMenuIcon,
  fill: '#808991',
};

import { Responsive, MQ } from './responsive';

export const header = {
  display: 'flex',
  padding: '50px 40px 30px 40px',
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium], {
    paddingTop: 28,
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0,
  }),
  ...Responsive.Large({
    flexDirection: 'column',
  }),
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    paddingLeft: 82,
  }),
};

const headerContentsWrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  overflow: 'hidden',
};

export const thumbnailWrapper = {
  ...headerContentsWrapper,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 215,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    minHeight: 275,
  }),
};

export const thumbnail = {
  width: 130,
  lineHeight: 0,
  overflowY: 'hidden',
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: 180,
  }),
};

export const outerTextLink = {
  marginTop: 16,
};

export const infoWrapper = {
  ...headerContentsWrapper,
  justifyContent: 'left',
  paddingTop: 42,
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium], {
    paddingTop: 24,
    alignItems: 'start',
  }),
  ...Responsive.Large({
    alignItems: 'center',
  }),
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    alignItems: 'start',
    paddingLeft: 40,
  }),
};

export const authorList = {
  marginTop: 12,
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium], {
    marginTop: 6,
  }),
};

export const fileInfo = {
  marginTop: 20,
  display: 'flex',
  alignItems: 'center',
};

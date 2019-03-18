import { Responsive, MQ } from './responsive';
import { Width } from './constants';

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
    justifyContent: 'space-between',
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
  justifyContent: 'flex-end',
  minHeight: 246,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    minHeight: 327,
    flex: '0 0 auto',
  }),
};

export const getResponsiveBookWidthForDetailHeader = screenWidth => (screenWidth && screenWidth >= Width.W834 ? 180 : 130);

export const thumbnail = {
  width: getResponsiveBookWidthForDetailHeader(),
  lineHeight: 0,
  overflowY: 'hidden',
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: getResponsiveBookWidthForDetailHeader(Width.W834),
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
    alignItems: 'flex-start',
  }),
  ...Responsive.Large({
    alignItems: 'center',
  }),
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    alignItems: 'flex-start',
    paddingLeft: 40,
    flex: 'auto',
    flexWrap: 'wrap',
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

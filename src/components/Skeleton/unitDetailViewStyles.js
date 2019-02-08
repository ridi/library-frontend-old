import { Responsive, MQ } from '../../styles/responsive';

const backgroundImage = 'linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb)';
const wrapperStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export const detailView = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 28,

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    marginTop: 50,
    flexDirection: 'row',
  }),

  ...MQ([Responsive.XXLarge, Responsive.Full], {
    marginLeft: 100,
  }),
};

export const thumbnailWrapper = {
  ...wrapperStyles,
};

export const thumbnail = {
  width: 130,
  height: 191,
  backgroundImage,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: 180,
    height: 265,
  }),
};

export const ridibooksLink = {
  marginTop: 16,
  width: 130,
  height: 20,
  backgroundImage,
};

export const infoWrapper = {
  marginTop: 24,
  alignItems: 'start',
  justifyContent: 'left',

  ...wrapperStyles,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    marginTop: 48,
    marginLeft: 40,
  }),
};

export const unitTitle = {
  width: 328,
  height: 24,
  backgroundImage,

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: 334,
    height: 28,
  }),
};

export const authorList = {
  marginTop: 8,
  width: 277,
  height: 20,
  backgroundImage,

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    marginTop: 16,
    width: 400,
    height: 20,
  }),
};

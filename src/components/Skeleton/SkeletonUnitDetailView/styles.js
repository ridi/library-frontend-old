import { MQ, Responsive } from '../../../styles/responsive';
import * as defaultLayout from '../../../styles/unitDetailViewHeader';

const backgroundImage = 'linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb)';

export const header = {
  ...defaultLayout.header,
};
export const thumbnailWrapper = {
  ...defaultLayout.thumbnailWrapper,
};
export const thumbnail = {
  ...defaultLayout.thumbnail,
  backgroundImage,
  width: 130,
  height: 191,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: 180,
    height: 265,
  }),
};

export const outerTextLink = {
  ...defaultLayout.outerTextLink,
  backgroundImage,
  width: 130,
  height: 20,
};
export const infoWrapper = {
  ...defaultLayout.infoWrapper,
};
export const title = {
  backgroundImage,
  width: 300,
  height: 30,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: 400,
    height: 30,
  }),
};
export const authorList = {
  ...defaultLayout.authorList,
  backgroundImage,
  width: 250,
  height: 19,
};
export const fileInfo = {
  ...defaultLayout.fileInfo,
  backgroundImage,
  width: 250,
  height: 20,
};

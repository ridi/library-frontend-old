import * as defaultLayout from '../../styles/unitDetailViewHeader';
import { MQ, Responsive } from '../../styles/responsive';

export const header = {
  ...defaultLayout.header,
};

export const thumbnailWrapper = {
  ...defaultLayout.thumbnailWrapper,
};

export const thumbnail = {
  ...defaultLayout.thumbnail,
  boxShadow: '2px 4px 10px rgba(0, 0, 0, .15)',
};

export const outerTextLink = {
  ...defaultLayout.outerTextLink,
  fontSize: 15,
  color: '#1f8ce6',
};

export const outerLinkIcon = {
  width: 9,
  height: 9,
  fill: '#1f8ce6',
  marginLeft: 3,
};

export const infoWrapper = {
  ...defaultLayout.infoWrapper,
};

export const unitTitle = {
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 1.54,
  color: '#212529',
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 1.03,
    letterSpacing: -0.6,
    color: '#212529',
  }),
};

export const authorList = {
  ...defaultLayout.authorList,
  fontSize: 15,
  color: '#40474d',
};

export const authorDelimiter = {
  width: 1,
  height: 10,
  margin: '0 2px',
  backgroundColor: '#d1d5d9',
  display: 'inline-block',
};

export const fileInfo = {
  ...defaultLayout.fileInfo,
};

export const starRateIcon = {
  width: 14,
  height: 14,
  marginRight: 4,
  marginBottom: 2,
  fill: '#ff884d',
};

export const starRate = {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#ff884d',
  marginRight: 4,
};

export const fileInfoText = {
  fontSize: 15,
  color: '#808991',
  height: 20,
  lineHeight: '20px',
};

export const fileInfoDelimiter = {
  width: 1,
  height: 10,
  margin: '0 5px',
  backgroundColor: '#d1d5d9',
};

export const description = {
  fontSize: 15,
  color: '#40474d',
  clear: 'both',
  padding: '8px 40px 40px 40px',
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium], {
    paddingLeft: 0,
    paddingRight: 0,
  }),
  ...Responsive.Large({
    paddingTop: 16,
  }),
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    paddingLeft: 82,
  }),
};
export const descriptionTitle = {
  fontWeight: 'bold',
  lineHeight: 'normal',
};
export const bookDescriptionBody = lineHeight => ({
  marginTop: 9,
  lineHeight: `${lineHeight}px`,
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
});
export const bookDescriptionFolded = (line, lineHeight) => ({
  maxHeight: line * lineHeight,
  WebkitLineClamp: line,
});
export const bookDescriptionExpended = {
  maxHeight: 'inherit',
  WebkitLineClamp: 'inherit',
};
export const bookDescriptionExpend = {
  textAlign: 'right',
  marginTop: 10,
};
export const bookDescription = {
  wordWrap: 'break-word',
  wordBreak: 'break-all',
  ':lang(ko)': {
    wordBreak: 'keep-all',
  },
};

export const bookDescriptionExpendButton = {
  fontSize: 15,
  textAlign: 'right',
  color: '#808991',
  fill: '#9ea7ad',
};

export const bookDescriptionExpendIcon = {
  width: 12,
  height: 9,
  marginLeft: 5,
};

const defaultButtonStyle = {
  width: 250,
  height: 50,
  borderRadius: 4,
  fontSize: 16,
  fontWeight: 'bold',
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium], {
    width: '100%',
  }),
};

export const downloadButton = {
  ...defaultButtonStyle,
  marginTop: 24,
  border: '1px solid #0077d9',
  boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
  backgroundColor: '#1f8ce6',
  color: 'white',
};
export const drmFreeDownloadButton = {
  ...defaultButtonStyle,
  marginTop: 10,
  border: '2px solid #d1d5d9',
  boxShadow: '1px 1px 1px 0 rgba(209, 213, 217, 0.3)',
  backgroundColor: 'white',
  color: '#808991',
};

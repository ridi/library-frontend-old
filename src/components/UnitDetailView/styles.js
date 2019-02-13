import { MQ, Responsive } from '../../styles/responsive';

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

export const headerContentsWrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
};

export const thumbnailWrapper = {
  ...headerContentsWrapper,
  alignItems: 'center',
  justifyContent: 'center',
};

export const thumbnail = {
  width: 130,
  boxShadow: '2px 4px 10px rgba(0, 0, 0, .15)',
  lineHeight: 0,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: 180,
  }),
};

export const outerTextLink = {
  fontSize: 15,
  color: '#1f8ce6',
  marginTop: 16,
};

export const outerLinkIcon = {
  width: 9,
  height: 9,
  fill: '#1f8ce6',
  marginLeft: 3,
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
  fontSize: 15,
  color: '#40474d',
  marginTop: 12,
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium], {
    marginTop: 6,
  }),
};

export const fileInfo = {
  marginTop: 20,
  fontSize: 15,
  color: '#808991',
};

export const fileInfoText = {
  float: 'left',
};

export const fileInfoDelimiter = {
  width: 1,
  height: 9,
  marginTop: 5,
  marginLeft: 5,
  marginRight: 5,
  backgroundColor: '#d1d5d9',
  float: 'left',
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

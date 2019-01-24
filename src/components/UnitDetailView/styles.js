import { Responsive } from '../../styles/responsive';

export const header = {
  display: 'flex',
  padding: '50px 40px 30px 40px',
  ...Responsive.W1280({
    paddingLeft: 82,
  }),
  ...Responsive.Pc({
    flexDirection: 'row',
  }),
  ...Responsive.Mobile({
    paddingTop: 28,
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0,
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
  ...Responsive.Pc({
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
  ...Responsive.Pc({
    alignItems: 'start',
    paddingLeft: 40,
  }),
  ...Responsive.Mobile({
    alignItems: 'center',
  }),
  ...Responsive.W360({
    paddingTop: 24,
    alignItems: 'start',
  }),
};

export const unitTitle = {
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 1.54,
  color: '#212529',

  ...Responsive.Pc({
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

  ...Responsive.W360({
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
  letterSpacing: -0.3,
  color: '#40474d',
  clear: 'both',
  padding: '8px 40px 40px 40px',

  ...Responsive.W1280({
    paddingLeft: 82,
  }),
  ...Responsive.Pc({
    paddingTop: 16,
  }),
  ...Responsive.Mobile({
    paddingLeft: 0,
    paddingRight: 0,
  }),
};
export const descriptionTitle = {
  fontWeight: 'bold',
  letterSpacing: -0.28,
  lineHeight: 'normal',
};
export const bookDescriptionBody = {
  marginTop: 9,
  lineHeight: 1.5,
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
};
export const bookDescriptionFolded = {
  // TODO: 변수화 해야 한다.
  maxHeight: 9 * 23,
  WebkitLineClamp: 9,
};
export const bookDescriptionExpended = {
  // TODO: 변수화 해야 한다.
  maxHeight: 'unset',
  WebkitLineClamp: 'unset',
};
export const bookDescriptionExpend = {
  textAlign: 'right',
  marginTop: 11.5,
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
  ...Responsive.W360({
    width: '100%',
  }),
};

export const downloadButton = {
  ...defaultButtonStyle,
  marginTop: 24,
  boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
  backgroundColor: '#1f8ce6',
  color: '#ffffff',
};
export const drmFreeDownloadButton = {
  ...defaultButtonStyle,
  marginTop: 10,
  boxShadow: '1px 1px 1px 0 rgba(209, 213, 217, 0.3)',
  backgroundColor: '#ffffff',
  color: '#808991',
};

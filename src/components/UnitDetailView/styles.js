import { Responsive } from '../../styles/responsive';

export const detailView = {
  display: 'flex',
  flexDirection: 'column',

  marginTop: 28,

  ...Responsive.Pc({
    marginTop: 50,
    flexDirection: 'row',
  }),

  ...Responsive.W1280({
    marginLeft: 100,
  }),
};

export const wrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export const thumbnailWrapper = {};
export const thumbnail = {
  backgroundImage: 'linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.0) 6%, rgba(0, 0, 0, 0.0) 94%, rgba(0, 0, 0, 0.2))',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  width: 130,

  ...Responsive.Pc({
    width: 180,
  }),
};
export const ridibooksLink = {
  fontSize: 15,
  letterSpacing: -0.3,
  color: '#1f8ce6',
  marginTop: 16,
};

export const infoWrapper = {
  marginTop: 24,

  alignItems: 'start',
  justifyContent: 'left',

  ...Responsive.Pc({
    marginTop: 48,
    marginLeft: 40,
  }),
};
export const unitTitle = {
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 1.54,
  letterSpacing: -0.4,
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
  marginTop: 8,
  fontSize: 15,
  letterSpacing: -0.3,
  color: '#40474d',

  ...Responsive.Pc({
    marginTop: 16,
  }),
};
export const bookDescription = {
  marginTop: 8,
  fontSize: 15,
  letterSpacing: -0.3,
  color: '#40474d',
  clear: 'both',

  ...Responsive.Pc({
    marginTop: 16,
  }),
};
export const bookDescriptionTitle = {
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
export const downloadButton = {
  width: '100%',
  marginTop: 10,
  marginBottom: 10,
  height: 50,
  borderRadius: 4,
  boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
  backgroundColor: '#1f8ce6',
  fontSize: 16,
  fontWeight: 'bold',
  color: '#ffffff',
  letterSpacing: -0.7,

  ...Responsive.Pc({
    width: 250,
  }),
};
export const drmFreeDownloadButton = {
  width: '100%',
  marginBottom: 10,
  height: 50,
  borderRadius: 4,
  boxShadow: '1px 1px 1px 0 rgba(209, 213, 217, 0.3)',
  backgroundColor: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
  color: '#808991',
  letterSpacing: -0.7,

  ...Responsive.Pc({
    width: 250,
  }),
};
export const fileInfo = {
  marginTop: 24,
  marginBottom: 10,
  fontSize: 15,
  letterSpacing: -0.3,
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

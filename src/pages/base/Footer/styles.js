import { maxWidthWrapper } from '../../../styles';
import { MQ, Responsive } from '../../../styles/responsive';

export const footerMargin = {
  height: 211,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    height: 183,
  }),
};

export const footer = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  boxSizing: 'border-box',
  padding: '24px 16px',
  backgroundColor: 'white',

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    paddingBottom: 42,
  }),
};

export const footerWrapper = {
  margin: '0 auto',
  ...maxWidthWrapper,
};

export const headingList = {
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    display: 'inline-block',
    verticalAlign: 'top',
  }),
};

export const headingItem = {
  position: 'relative',
  display: 'inline-block',
  fontSize: 16,
  fontWeight: 'bold',
  color: '#40474d',

  padding: '0 8px',
  ':first-of-type': {
    padding: '0 6px 0 0',
    letterSpacing: 'normal',
  },
};

export const contentList = {
  ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large], {
    margin: '12px -16px 0 -16px',
    width: 320,
  }),

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    display: 'inline-block',
    verticalAlign: 'top',
    width: 534,
    marginTop: 2,
    marginLeft: 24,
  }),
};

export const contentItem = {
  marginTop: 12,
  marginLeft: 16,
  display: 'inline-block',
  height: 17,
  width: 144,
  lineHeight: '17px',
  fontSize: 14,

  letterSpacing: -0.2,

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    marginTop: 0,
    ':nth-of-type(n+4)': {
      marginTop: 16,
    },
  }),
};

export const hideInMobile = {
  display: 'none',

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    display: 'inline-block',
  }),
};

export const footerPaperIcon = {
  width: 46,
  height: 12,
};

export const footerNewIcon = {
  marginLeft: 4,
  width: 12,
  height: 12,
  fill: '#339cf2',
};

export const footerTermWrapper = {
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    marginTop: 42,
  }),
};

export const copyright = {
  marginTop: 24,
  color: '#9ea7ad',
  fontSize: 14,
  height: 17,
  lineHeight: '17px',

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    display: 'inline-block',
    marginTop: 0,
  }),
};

export const termsList = {
  marginTop: 10,

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    display: 'inline-block',
    verticalAlign: 'top',
    marginTop: 0,
    marginLeft: 24,
  }),
};

export const termsItem = {
  position: 'relative',
  display: 'inline-block',
  height: 20,
  fontSize: 11,
  lineHeight: '20px',
  letterSpacing: -0.2,
  color: '#9ea7ad',

  padding: '0 6px',
  ':first-of-type': {
    paddingLeft: 0,
  },
};

export const verticalSeparator = {
  '&::before': {
    content: `''`,
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate3d(0, -50%, 0)',
    width: 1,
    height: 10,
    background: '#9ea7ad',
  },
};

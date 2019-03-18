import { maxWidthWrapper } from '../../../styles';
import { MQ, Responsive } from '../../../styles/responsive';

export const footerMargin = {
  height: 124,
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    height: 124,
  }),
};

export const footer = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  boxSizing: 'border-box',
  padding: '2px 0px 30px 0px',
  backgroundColor: '#f3f4f5',
  textAlign: 'center',

  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    paddingBottom: 42,
  }),
};

export const footerWrapper = {
  margin: '0 auto',
  ...maxWidthWrapper,
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
    right: 0,
    top: '50%',
    transform: 'translate3d(0, -50%, 0)',
    width: 1,
    height: 10,
    background: '#9ea7ad',
  },
};

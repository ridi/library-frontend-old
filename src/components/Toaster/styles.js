import { ToastStyle } from '../../services/toast/constants';
import { Responsive, MQ } from '../../styles/responsive';

const isWrapperNarrow = [Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large];
const isWrapperWide = [Responsive.XLarge, Responsive.XXLarge, Responsive.Full];

export const toastWrapper = {
  position: 'fixed',
  left: 0,
  right: 0,
  zIndex: 9999,
  padding: '0 10px',
  ...MQ(isWrapperNarrow, {
    bottom: 10,
  }),
  ...MQ(isWrapperWide, {
    top: 72,
  }),
};

export const toast = {
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '400px',
  margin: '10px auto',
  padding: 15,

  borderRadius: 4,
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, .5)',
  background: 'rgba(0, 0, 0, .87)',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  ...MQ(isWrapperNarrow, {
    bottom: 10,
  }),
  ...MQ(isWrapperWide, {
    top: 72,
  }),
};

const getAnimation = duration => ({
  duration: `${duration / 1000}s`,
  hide: {
    opacity: 0,
    ...MQ(isWrapperNarrow, {
      transform: 'translate3d(0, 50px, 0)',
    }),
    ...MQ(isWrapperWide, {
      transform: 'translate3d(0, -50px, 0)',
    }),
  },
  show: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
});

export const toggleAnimation = duration => {
  const animation = getAnimation(duration);
  return {
    ...animation.hide,
    transition: `opacity ${animation.duration}, transform ${animation.duration}`,
    '&.entering, &.exiting': {
      ...animation.hide,
    },
    '&.entered': {
      ...animation.show,
    },
  };
};

export const toastTypeMark = {
  width: 16,
  height: 16,
  marginRight: 6,
  alignSelf: 'flex-start',
};

const toastStyleColor = toastStyle => {
  switch (toastStyle) {
    case ToastStyle.BLUE:
      return '#99d1ff';
    default:
      return '#5abf0d';
  }
};

export const toastTypeMarkIcon = toastStyle => ({
  width: '100%',
  height: '100%',
  fill: toastStyleColor(toastStyle),
});

export const toastContent = toastStyle => ({
  fontSize: 14,
  letterSpacing: -0.7,
  color: toastStyleColor(toastStyle),
  wordBreak: 'break-word',
  flex: 'auto',
});

export const toastContentMessage = {
  marginRight: 6,
  lineHeight: '18px',
};

export const toastLink = {
  fontSize: 13,
  fontWeight: 'bold',
  letterSpacing: -0.7,
  textAlign: 'right',
  color: 'white',
  lineHeight: '18px',
};

export const toastLinkArrowIcon = {
  display: 'inline-block',
  width: 6,
  height: 6,
  fill: 'white',
  marginLeft: 6,
  verticalAlign: '6%',
};

export const toastCloseButton = {
  marginLeft: 5,
  width: 15,
  height: 15,
  fill: '#666666',
};

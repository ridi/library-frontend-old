import { ToastStyle } from '../../services/toast/constants';
import { Responsive, MQ } from '../../styles/responsive';

const isNarrowWrapper = [Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large];
const isWideWrapper = [Responsive.XLarge, Responsive.XXLarge, Responsive.Full];

export const toastWrapper = {
  position: 'fixed',
  left: 0,
  width: '100%',
  zIndex: 9999,
  ...MQ(isNarrowWrapper, {
    bottom: 10,
  }),
  ...MQ(isWideWrapper, {
    top: 72,
  }),
};

export const toast = {
  position: 'absolute',
  left: '50%',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '400px',
  padding: '0 10px',
  ...MQ(isNarrowWrapper, {
    bottom: 10,
  }),
  ...MQ(isWideWrapper, {
    top: 72,
  }),
};

const getAnimation = duration => ({
  duration: `${duration / 1000}s`,
  hide: {
    opacity: 0,
    ...MQ(isNarrowWrapper, {
      transform: 'translate3d(-50%, 50px, 0)',
    }),
    ...MQ(isWideWrapper, {
      transform: 'translate3d(-50%, -50px, 0)',
    }),
  },
  show: {
    opacity: 1,
    transform: 'translate3d(-50%, 0, 0)',
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

export const toastContentsBox = {
  boxSizing: 'border-box',
  width: '100%',
  padding: 15,
  borderRadius: 4,
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, .5)',
  background: 'rgba(0, 0, 0, .87)',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
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

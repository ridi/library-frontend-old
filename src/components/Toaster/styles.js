import { ToastStyle } from '../../services/toast/constants';

export const toastWrapper = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 10,
  zIndex: 9999,
};

export const toast = {
  boxSizing: 'border-box',
  width: 340,
  margin: '10px auto',
  padding: 15,

  opacity: 0.9,
  borderRadius: 4,
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
  backgroundColor: 'black',

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
  flex: 1,
});

export const toastContentMessage = {
  marginRight: 6,
};

export const toastLink = {
  fontSize: 13,
  fontWeight: 'bold',
  letterSpacing: -0.7,
  textAlign: 'right',
  color: 'white',
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
  backgroundColor: '#000',
  fill: '#666666',
};

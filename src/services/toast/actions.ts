import { Duration, ToastStyle } from './constants';

export const SET_TOAST = 'SET_TOAST';
export const UNSET_TOAST = 'UNSET_TOAST';

export const SHOW_TOAST = 'SHOW_TOAST';
export const CLOSE_TOAST = 'CLOSE_TOAST';

export const CLOSE_WITH_DELAY = 'CLOSE_WITH_DELAY';
export const CANCEL_CLOSE = 'CANCEL';

export const setToast = toastState => ({
  type: SET_TOAST,
  payload: {
    ...toastState,
  },
});

export const unsetToast = () => ({
  type: UNSET_TOAST,
});

interface ShowToastPayload {
  message: string;
  linkName?: string;
  linkProps?: any;
  outLink?: string;
  duration?: Duration | number;
  toastStyle?: ToastStyle;
  withBottomFixedButton?: boolean;
}

export const showToast = ({ message, linkName, linkProps, outLink, duration, toastStyle, withBottomFixedButton }: ShowToastPayload) => ({
  type: SHOW_TOAST,
  payload: {
    message,
    linkName,
    linkProps,
    outLink,
    withBottomFixedButton: withBottomFixedButton || false,
    duration: duration || Duration.NORMAL,
    toastStyle: toastStyle || ToastStyle.GREEN,
  },
});

export const closeToast = () => ({
  type: CLOSE_TOAST,
});

export const closeWithDelay = duration => ({
  type: CLOSE_WITH_DELAY,
  payload: {
    duration,
  },
});

export const cancelClose = () => ({
  type: CANCEL_CLOSE,
});

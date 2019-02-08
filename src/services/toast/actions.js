import { Duration } from './constants';

export const SET_TOAST = 'SET_TOAST';
export const UNSET_TOAST = 'UNSET_TOAST';

export const SHOW_TOAST = 'SHOW_TOAST';
export const CLOSE_TOAST = 'CLOSE_TOAST';

export const CLOSE_WITH_DELAY = 'CLOSE_WITH_DELAY';
export const CANCEL_CLOSE = 'CANCEL';

export const setToast = (message, linkName, linkProps, duration) => ({
  type: SET_TOAST,
  payload: {
    message,
    linkName,
    linkProps,
    duration,
  },
});

export const unsetToast = () => ({
  type: UNSET_TOAST,
});

export const showToast = (message, linkName, linkProps, duration = Duration.NORMAL) => ({
  type: SHOW_TOAST,
  payload: {
    duration,
    message,
    linkName,
    linkProps,
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

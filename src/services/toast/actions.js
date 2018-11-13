export const SET_TOAST = 'SET_TOAST';
export const UNSET_TOAST = 'UNSET_TOAST';

export const SHOW_TOAST = 'SHOW_TOAST';
export const CLOSE_TOAST = 'CLOSE_TOAST';

export const setToast = (message, uri) => ({
  type: SET_TOAST,
  payload: {
    message,
    uri,
  },
});

export const unsetToast = () => ({
  type: UNSET_TOAST,
});

export const showToast = (duration, message, uri) => ({
  type: SHOW_TOAST,
  payload: {
    duration,
    message,
    uri,
  },
});

export const closeToast = () => ({
  type: CLOSE_TOAST,
});

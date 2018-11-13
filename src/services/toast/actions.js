export const SHOW_TOAST = 'SHOW_TOAST';
export const CLOSE_TOAST = 'CLOSE_TOAST';

export const showToast = (message, duration, uri, enableClose) => ({
  type: SHOW_TOAST,
  payload: {
    message,
    duration,
    uri,
    enableClose,
  },
});

export const closeToast = () => ({
  type: CLOSE_TOAST,
});

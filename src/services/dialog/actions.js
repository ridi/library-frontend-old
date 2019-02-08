export const SET_DIALOG = 'SET_DIALOG';

export const showDialog = (title, message) => ({
  type: SET_DIALOG,
  payload: {
    dialog: {
      title,
      message,
    },
  },
});

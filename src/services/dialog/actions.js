export const SET_DIALOG = 'SET_DIALOG';
export const UNSET_DIALOG = 'UNSET_DIALOG';

export const showDialog = (title, message) => ({
  type: SET_DIALOG,
  payload: {
    dialog: {
      title,
      message,
    },
  },
});

export const closeDialog = () => ({
  type: UNSET_DIALOG,
});

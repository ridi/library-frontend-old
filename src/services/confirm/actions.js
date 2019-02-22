export const SET_CONFIRM = 'SET_CONFIRM';
export const UNSET_CONFIRM = 'UNSET_CONFIRM';

export const showConfirm = (title, message, confirmLabel, onClickConfirmButton) => ({
  type: SET_CONFIRM,
  payload: {
    confirm: {
      title,
      message,
      confirmLabel,
      onClickConfirmButton,
    },
  },
});

export const closeConfirm = () => ({
  type: UNSET_CONFIRM,
});

import produce from 'immer';
import { SET_TOAST, UNSET_TOAST } from './actions';

const initialState = {
  isShow: false,
};

const toastReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_TOAST:
      return {
        ...action.payload,
        isShow: true,
      };
    case UNSET_TOAST:
      draft.isShow = false;
      break;
    default:
      break;
  }
  return draft;
}, initialState);

export default toastReducer;

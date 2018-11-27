import { SET_TOAST, UNSET_TOAST } from './actions';

const initialState = {
  toast: null,
};

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOAST:
      return {
        toast: action.payload,
      };
    case UNSET_TOAST:
      return {
        toast: null,
      };
    default:
      return state;
  }
};

export default toastReducer;

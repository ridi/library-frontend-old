import { SHOW_TOAST, CLOSE_TOAST } from './actions';

const initialState = {
  toast: null,
};

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        toast: action.payload,
      };
    case CLOSE_TOAST:
      return {
        toast: null,
      };
    default:
      return state;
  }
};

export default toastReducer;

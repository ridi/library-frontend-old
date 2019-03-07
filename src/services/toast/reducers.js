import { SET_TOAST, UNSET_TOAST } from './actions';

const initialState = null;

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOAST:
      return {
        ...action.payload,
        isShow: true,
      };
    case UNSET_TOAST:
      return {
        ...state,
        isShow: false,
      };
    default:
      return state;
  }
};

export default toastReducer;

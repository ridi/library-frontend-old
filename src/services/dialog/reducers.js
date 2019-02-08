import { SET_DIALOG } from './actions';
import { initialState } from './state';

const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DIALOG:
      return {
        ...state,
        dialog: action.payload.dialog,
      };
    default:
      return state;
  }
};

export default dialogReducer;

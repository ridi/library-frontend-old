import { SET_DIALOG, UNSET_DIALOG } from './actions';
import { initialState } from './state';

const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DIALOG:
      return action.payload.dialog;
    case UNSET_DIALOG:
      return null;
    default:
      return state;
  }
};

export default dialogReducer;

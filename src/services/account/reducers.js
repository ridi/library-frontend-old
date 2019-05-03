import produce from 'immer';
import { SET_USER_INFO } from './actions';

const initialState = {};

const accountReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      draft.userInfo = action.payload.userInfo;
      break;
    default:
      break;
  }
}, initialState);

export default accountReducer;

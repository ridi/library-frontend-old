import produce from 'immer';
import { SET_NEED_LOGIN, SET_USER_INFO } from './actions';

const initialState = {
  userInfo: null,
  needLogin: false,
};

const accountReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      draft.userInfo = action.payload.userInfo;
      draft.needLogin = false;
      break;
    case SET_NEED_LOGIN:
      draft.needLogin = true;
      break;
    default:
      break;
  }
}, initialState);

export default accountReducer;

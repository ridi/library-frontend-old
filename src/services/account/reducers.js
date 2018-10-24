
import { SET_USER_INFO } from './actions';

const accountReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload.userInfo,
      }
    default:
      return state;
  }
};

export default accountReducer;

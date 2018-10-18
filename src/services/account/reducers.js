
import { SET_USER_INFO } from './actions';

const accountReducer = (state = {}, action) => {
  switch (action) {
    case SET_USER_INFO:
      return {
        ...state,
        ...aciton.payload.userInfo,
      }
  }
};

export default accountReducer;

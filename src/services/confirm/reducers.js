import { SET_CONFIRM, UNSET_CONFIRM } from './actions';
import { initialState } from './state';

const confirmReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIRM:
      return action.payload.confirm;
    case UNSET_CONFIRM:
      return null;
    default:
      return state;
  }
};

export default confirmReducer;

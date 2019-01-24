import { SET_VIEW_TYPE } from './actions';
import { initialState } from './state';

const viewTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW_TYPE:
      return action.payload.viewType;
    default:
      return state;
  }
};

export default viewTypeReducer;

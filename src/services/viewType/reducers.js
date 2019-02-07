import { setCookie } from 'nookies';
import { SET_VIEW_TYPE } from './actions';
import { initialState } from './state';

const viewTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW_TYPE:
      setCookie(null, SET_VIEW_TYPE, action.payload.viewType);
      return action.payload.viewType;
    default:
      return state;
  }
};

export default viewTypeReducer;

import produce from 'immer';

import { SET_FEATURE } from './actions';

const initialState = {};

const featureReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_FEATURE:
      draft[action.payload.featureId] = action.payload.value;
      break;
    default:
      break;
  }
}, initialState);

export default featureReducer;

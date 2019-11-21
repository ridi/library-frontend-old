import produce from 'immer';

import { SET_FULL_SCREEN_LOADING, SET_IS_ERROR, SET_VIEW_TYPE } from './actions';
import { initialState } from './state';

const uiReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_FULL_SCREEN_LOADING:
      draft.fullScreenLoading = action.payload.isLoading;
      break;
    case SET_VIEW_TYPE:
      draft.viewType = action.payload.viewType;
      break;
    case SET_IS_ERROR:
      draft.isError = action.payload.isError;
      break;
    default:
      break;
  }
}, initialState);

export default uiReducer;

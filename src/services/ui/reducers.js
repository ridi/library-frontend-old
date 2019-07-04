import produce from 'immer';
// import settings from '../../utils/settings';
import { SET_VIEW_TYPE, SET_FULL_SCREEN_LOADING, SET_IS_ERROR } from './actions';
import { initialState } from './state';

const uiReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_FULL_SCREEN_LOADING:
      draft.fullScreenLoading = action.payload.isLoading;
      break;
    case SET_VIEW_TYPE:
      // TODO: 사이드이펙트 없애기
      // settings.viewType = action.payload.viewType;
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

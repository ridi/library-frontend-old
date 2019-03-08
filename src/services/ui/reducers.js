import nookies from 'nookies';
import { SET_VIEW_TYPE, SET_FULL_SCREEN_LOADING, SET_IS_ERROR, SET_LOADING_READ_LATEST } from './actions';
import { initialState } from './state';

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FULL_SCREEN_LOADING:
      return {
        ...state,
        fullScreenLoading: action.payload.isLoading,
      };
    case SET_VIEW_TYPE:
      nookies.set(null, SET_VIEW_TYPE, action.payload.viewType, { path: '/' });
      return {
        ...state,
        viewType: action.payload.viewType,
      };
    case SET_IS_ERROR:
      return {
        ...state,
        isError: action.payload.isError,
      };
    case SET_LOADING_READ_LATEST:
      return {
        ...state,
        loadingReadLatest: action.payload.loadingReadLatest,
      };
    default:
      return state;
  }
};

export default uiReducer;

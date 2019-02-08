import { SET_FULL_SCREEN_LOADING } from './actions';
import { initialState } from './state';

const fullScreenLoadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FULL_SCREEN_LOADING:
      return action.payload.isLoading;
    default:
      return state;
  }
};

export default fullScreenLoadingReducer;

import { initialState } from './state';

import { SET_SEARCH_PAGE, SET_SEARCH_KEYWORD } from './actions';

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case SET_SEARCH_KEYWORD:
      return {
        ...state,
        keyword: action.payload.keyword,
      };
    default:
      return state;
  }
};

export default searchReducer;

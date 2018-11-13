import { initialState } from './state';

import { SET_SEARCH_ITEMS, SET_SEARCH_TOTAL_COUNT, SET_SEARCH_PAGE, SET_SEARCH_KEYWORD } from './actions';

const purchasedSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          [state.page]: action.payload.items,
        },
      };
    case SET_SEARCH_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
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

export default purchasedSearchReducer;

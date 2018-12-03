import { initialState } from './state';

import {
  SET_SEARCH_ITEMS,
  SET_SEARCH_TOTAL_COUNT,
  SET_SEARCH_PAGE,
  SET_SEARCH_KEYWORD,
  CLEAR_SELECTED_SEARCH_BOOKS,
  TOGGLE_SELECT_SEARCH_BOOK,
} from './actions';
import { toDict, toFlatten } from '../../../utils/array';

const purchasedSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          ...toDict(action.payload.items, 'b_id'),
        },
        itemIdsForPage: {
          ...state.itemIdsForPage,
          [state.page]: toFlatten(action.payload.items, 'b_id'),
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
    case CLEAR_SELECTED_SEARCH_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_SEARCH_BOOK:
      const { selectedBooks } = state;
      if (state.selectedBooks[action.payload.bookId]) {
        delete selectedBooks[action.payload.bookId];
      } else {
        selectedBooks[action.payload.bookId] = 1;
      }

      return {
        ...state,
        selectedBooks,
      };
    default:
      return state;
  }
};

export default purchasedSearchReducer;

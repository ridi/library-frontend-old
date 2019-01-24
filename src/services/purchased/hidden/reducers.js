import { initialState } from './state';
import {
  SET_HIDDEN_ITEMS,
  SET_HIDDEN_TOTAL_COUNT,
  SET_HIDDEN_PAGE,
  CLEAR_SELECTED_HIDDEN_BOOKS,
  TOGGLE_SELECT_HIDDEN_BOOK,
  SELECT_HIDDEN_BOOKS,
  SET_HIDDEN_IS_FETCHING_BOOKS,
} from './actions';

import { toDict, toFlatten } from '../../../utils/array';

const purchasedHiddenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HIDDEN_ITEMS:
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
    case SET_HIDDEN_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_HIDDEN_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case CLEAR_SELECTED_HIDDEN_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_HIDDEN_BOOK:
      const { selectedBooks } = state;
      if (selectedBooks[action.payload.bookId]) {
        delete selectedBooks[action.payload.bookId];
      } else {
        selectedBooks[action.payload.bookId] = 1;
      }

      return {
        ...state,
        selectedBooks,
      };
    case SELECT_HIDDEN_BOOKS:
      return {
        ...state,
        selectedBooks: action.payload.bookIds.reduce((previous, bookId) => {
          previous[bookId] = 1;
          return previous;
        }, {}),
      };
    case SET_HIDDEN_IS_FETCHING_BOOKS:
      return {
        ...state,
        isFetchingBooks: action.payload.isFetchingBooks,
      };
    default:
      return state;
  }
};

export default purchasedHiddenReducer;

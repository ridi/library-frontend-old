import { initialState } from './state';
import {
  SET_PURCHASED_HIDDEN_ITEMS,
  SET_PURCHASED_HIDDEN_TOTAL_COUNT,
  SET_PURCHASED_HIDDEN_PAGE,
  CLEAR_SELECTED_HIDDEN_BOOKS,
  TOGGLE_SELECT_HIDDEN_BOOK,
} from './actions';

import { toDict, toFlatten } from '../../../utils/array';

const purchasedHiddenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASED_HIDDEN_ITEMS:
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
    case SET_PURCHASED_HIDDEN_TOTAL_COUNT:
      return {
        ...state,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_PURCHASED_HIDDEN_PAGE:
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

export default purchasedHiddenReducer;

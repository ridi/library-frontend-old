import { initialState } from './state';

import {
  SET_PURCHASE_ITEMS,
  SET_PURCHASE_TOTAL_COUNT,
  SET_PURCHASE_PAGE,
  SET_PURCHASE_ORDER,
  SET_PURCHASE_FILTER,
  SET_PURCHASE_FILTER_OPTIONS,
  CLEAR_SELECTED_BOOKS,
  TOGGLE_SELECT_BOOK,
} from './actions';

import { toDict, toFlatten } from '../../../utils/array';

const purchasedMainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASE_ITEMS:
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
    case SET_PURCHASE_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_PURCHASE_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case SET_PURCHASE_ORDER:
      return {
        ...state,
        order: action.payload.order,
      };
    case SET_PURCHASE_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          selected: action.payload.filter,
        },
      };
    case SET_PURCHASE_FILTER_OPTIONS:
      return {
        ...state,
        filter: {
          ...state.filter,
          options: action.payload.options,
        },
      };
    case CLEAR_SELECTED_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_BOOK:
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

export default purchasedMainReducer;

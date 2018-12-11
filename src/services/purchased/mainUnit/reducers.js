import { initialState } from './state';

import {
  CLEAR_SELECTED_MAIN_UNIT_BOOKS,
  SET_MAIN_UNIT_FILTER,
  SET_MAIN_UNIT_FILTER_OPTIONS,
  SET_MAIN_UNIT_ID,
  SET_MAIN_UNIT_ITEMS,
  SET_MAIN_UNIT_ORDER,
  SET_MAIN_UNIT_PAGE,
  SET_MAIN_UNIT_TOTAL_COUNT,
  SET_SELECT_MAIN_UNIT_BOOKS,
  TOGGLE_SELECT_MAIN_UNIT_BOOK,
} from './actions';
import { toDict, toFlatten } from '../../../utils/array';

const purchasedMainUnitReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAIN_UNIT_ITEMS:
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
    case SET_MAIN_UNIT_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_MAIN_UNIT_ID:
      return {
        ...state,
        unitId: action.payload.unitId,
      };
    case SET_MAIN_UNIT_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case SET_MAIN_UNIT_ORDER:
      return {
        ...state,
        order: action.payload.order,
      };
    case SET_MAIN_UNIT_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          selected: action.payload.filter,
        },
      };
    case SET_MAIN_UNIT_FILTER_OPTIONS:
      return {
        ...state,
        filter: {
          ...state.filter,
          options: action.payload.options,
        },
      };
    case CLEAR_SELECTED_MAIN_UNIT_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_MAIN_UNIT_BOOK:
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
    case SET_SELECT_MAIN_UNIT_BOOKS:
      return {
        ...state,
        selectedBooks: action.payload.bookIds.reduce((previous, bookId) => {
          previous[bookId] = 1;
          return previous;
        }, {}),
      };
    default:
      return state;
  }
};

export default purchasedMainUnitReducer;

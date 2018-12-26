import { initialState } from './state';

import {
  CLEAR_SELECTED_HIDDEN_UNIT_BOOKS,
  SET_HIDDEN_UNIT_ID,
  SET_HIDDEN_UNIT_ITEMS,
  SET_HIDDEN_UNIT_PAGE,
  SET_HIDDEN_UNIT_TOTAL_COUNT,
  SELECT_HIDDEN_UNIT_BOOKS,
  TOGGLE_SELECT_HIDDEN_UNIT_BOOK,
  SET_HIDDEN_UNIT,
} from './actions';
import { toDict, toFlatten } from '../../../utils/array';

const hiddenUnitReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HIDDEN_UNIT_ITEMS:
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
    case SET_HIDDEN_UNIT:
      return {
        ...state,
        unit: action.payload.unit,
      };
    case SET_HIDDEN_UNIT_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_HIDDEN_UNIT_ID:
      return {
        ...state,
        unitId: action.payload.unitId,
      };
    case SET_HIDDEN_UNIT_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case CLEAR_SELECTED_HIDDEN_UNIT_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_HIDDEN_UNIT_BOOK:
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
    case SELECT_HIDDEN_UNIT_BOOKS:
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

export default hiddenUnitReducer;

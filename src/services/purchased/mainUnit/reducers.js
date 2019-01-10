import { initialState, initialDataState, getKey } from './state';

import {
  CLEAR_SELECTED_MAIN_UNIT_BOOKS,
  SET_MAIN_UNIT_ID,
  SET_MAIN_UNIT_ITEMS,
  SET_MAIN_UNIT_ORDER,
  SET_MAIN_UNIT_PAGE,
  SET_MAIN_UNIT_TOTAL_COUNT,
  SELECT_MAIN_UNIT_BOOKS,
  TOGGLE_SELECT_MAIN_UNIT_BOOK,
} from './actions';
import { toDict, toFlatten } from '../../../utils/array';

const purchasedMainUnitReducer = (state = initialState, action) => {
  const key = getKey(state);
  const dataState = state.data[key] || initialDataState;

  switch (action.type) {
    case SET_MAIN_UNIT_ITEMS:
      return {
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...dataState,
            items: {
              ...dataState.items,
              ...toDict(action.payload.items, 'b_id'),
            },
            itemIdsForPage: {
              ...dataState.itemIdsForPage,
              [dataState.page]: toFlatten(action.payload.items, 'b_id'),
            },
          },
        },
      };
    case SET_MAIN_UNIT_TOTAL_COUNT:
      return {
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...dataState,
            itemTotalCount: action.payload.itemTotalCount,
          },
        },
      };
    case SET_MAIN_UNIT_PAGE:
      return {
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...dataState,
            page: action.payload.page,
          },
        },
      };
    case SET_MAIN_UNIT_ID:
      return {
        ...state,
        unitId: action.payload.unitId,
      };
    case SET_MAIN_UNIT_ORDER:
      return {
        ...state,
        order: action.payload.order,
      };
    case CLEAR_SELECTED_MAIN_UNIT_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_MAIN_UNIT_BOOK:
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
    case SELECT_MAIN_UNIT_BOOKS:
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

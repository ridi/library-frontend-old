import { initialState, initialDataState } from './state';

import {
  CLEAR_SELECTED_SEARCH_UNIT_BOOKS,
  SET_SEARCH_UNIT,
  SET_SEARCH_UNIT_ID,
  SET_SEARCH_UNIT_ITEMS,
  SET_SEARCH_UNIT_KEYWORD,
  SET_SEARCH_UNIT_ORDER,
  SET_SEARCH_UNIT_PAGE,
  SET_SEARCH_UNIT_TOTAL_COUNT,
  SET_SELECT_SEARCH_UNIT_BOOKS,
  TOGGLE_SELECT_SEARCH_UNIT_BOOK,
} from './actions';
import { toDict, toFlatten } from '../../../utils/array';
import { getDataState } from '../../../utils/state';

const searchUnitReducer = (state = initialState, action) => {
  const { key, dataState } = getDataState(state, [state.unitId, state.order], initialDataState);

  switch (action.type) {
    case SET_SEARCH_UNIT_ITEMS:
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
    case SET_SEARCH_UNIT:
      return {
        ...state,
        units: {
          ...state.units,
          [state.unitId]: action.payload.unit,
        },
      };
    case SET_SEARCH_UNIT_TOTAL_COUNT:
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
    case SET_SEARCH_UNIT_ID:
      return {
        ...state,
        unitId: action.payload.unitId,
      };
    case SET_SEARCH_UNIT_PAGE:
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
    case SET_SEARCH_UNIT_ORDER:
      return {
        ...state,
        order: action.payload.order,
      };
    case SET_SEARCH_UNIT_KEYWORD:
      return {
        ...state,
        keyword: action.payload.keyword,
      };
    case CLEAR_SELECTED_SEARCH_UNIT_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_SEARCH_UNIT_BOOK:
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
    case SET_SELECT_SEARCH_UNIT_BOOKS:
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

export default searchUnitReducer;

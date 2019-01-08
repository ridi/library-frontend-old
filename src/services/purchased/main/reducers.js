import { initialState, initialDataState, getKey } from './state';

import {
  CLEAR_SELECTED_MAIN_BOOKS,
  SET_MAIN_FILTER,
  SET_MAIN_FILTER_OPTIONS,
  SET_MAIN_ITEMS,
  SET_MAIN_ORDER,
  SET_MAIN_PAGE,
  SET_MAIN_TOTAL_COUNT,
  SELECT_MAIN_BOOKS,
  TOGGLE_SELECT_MAIN_BOOK,
  SET_IS_FETCHING_BOOKS,
} from './actions';

import { toDict, toFlatten } from '../../../utils/array';
import { getOrDefault } from '../../../utils/dict';

const mainReducer = (state = initialState, action) => {
  const key = getKey(state);
  const dataState = getOrDefault(state.data, key, initialDataState);

  switch (action.type) {
    case SET_MAIN_ITEMS:
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
    case SET_MAIN_TOTAL_COUNT:
      return {
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...dataState,
            unitTotalCount: action.payload.unitTotalCount,
            itemTotalCount: action.payload.itemTotalCount,
          },
        },
      };
    case SET_MAIN_PAGE:
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

    case SET_MAIN_ORDER:
      return {
        ...state,
        order: action.payload.order,
      };
    case SET_MAIN_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          selected: action.payload.filter,
        },
      };
    case SET_MAIN_FILTER_OPTIONS:
      return {
        ...state,
        filter: {
          ...state.filter,
          options: action.payload.options,
        },
      };
    case CLEAR_SELECTED_MAIN_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_MAIN_BOOK:
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
    case SELECT_MAIN_BOOKS:
      return {
        ...state,
        selectedBooks: action.payload.bookIds.reduce((previous, bookId) => {
          previous[bookId] = 1;
          return previous;
        }, {}),
      };
    case SET_IS_FETCHING_BOOKS:
      return {
        ...state,
        isFetchingBooks: action.payload.isFetchingBooks,
      };
    default:
      return state;
  }
};

export default mainReducer;

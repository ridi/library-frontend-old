import { initialState, initialDataState, getKey } from './state';

import {
  CLEAR_SELECTED_SERIAL_PREFERENCE_BOOKS,
  SET_SERIAL_PREFERENCE_ITEMS,
  SET_SERIAL_PREFERENCE_PAGE,
  SET_SERIAL_PREFERENCE_TOTAL_COUNT,
  SELECT_SERIAL_PREFERENCE_BOOKS,
  TOGGLE_SELECT_SERIAL_PREFERENCE_BOOK,
  SET_IS_FETCHING_BOOKS,
} from './actions';

import { toDict, toFlatten } from '../../utils/array';

const serialPreferenceReducer = (state = initialState, action) => {
  const key = getKey(state);
  const dataState = state.data[key] || initialDataState;

  switch (action.type) {
    case SET_SERIAL_PREFERENCE_ITEMS:
      return {
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...dataState,
            items: {
              ...dataState.items,
              ...toDict(action.payload.items, 'series_id'),
            },
            itemIdsForPage: {
              ...dataState.itemIdsForPage,
              [dataState.page]: toFlatten(action.payload.items, 'series_id'),
            },
          },
        },
      };
    case SET_SERIAL_PREFERENCE_TOTAL_COUNT:
      return {
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...dataState,
            totalCount: action.payload.totalCount,
          },
        },
      };
    case SET_SERIAL_PREFERENCE_PAGE:
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
    case CLEAR_SELECTED_SERIAL_PREFERENCE_BOOKS:
      return {
        ...state,
        selectedBooks: {},
      };
    case TOGGLE_SELECT_SERIAL_PREFERENCE_BOOK:
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
    case SELECT_SERIAL_PREFERENCE_BOOKS:
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

export default serialPreferenceReducer;

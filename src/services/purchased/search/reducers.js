import { initialState, initialDataState, getKey } from './state';

import {
  SET_SEARCH_ITEMS,
  SET_SEARCH_TOTAL_COUNT,
  SET_SEARCH_PAGE,
  SET_SEARCH_KEYWORD,
  CLEAR_SELECTED_SEARCH_BOOKS,
  TOGGLE_SELECT_SEARCH_BOOK,
  SELECT_SEARCH_BOOKS,
  SET_SEARCH_IS_FETCHING_BOOKS,
} from './actions';
import { toDict, toFlatten } from '../../../utils/array';

const purchasedSearchReducer = (state = initialState, action) => {
  const key = getKey(state);
  const dataState = state.data[key] || initialDataState;

  switch (action.type) {
    case SET_SEARCH_ITEMS:
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
    case SET_SEARCH_TOTAL_COUNT:
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
    case SET_SEARCH_PAGE:
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
      if (selectedBooks[action.payload.bookId]) {
        delete selectedBooks[action.payload.bookId];
      } else {
        selectedBooks[action.payload.bookId] = 1;
      }

      return {
        ...state,
        selectedBooks,
      };
    case SELECT_SEARCH_BOOKS:
      return {
        ...state,
        selectedBooks: action.payload.bookIds.reduce((previous, bookId) => {
          previous[bookId] = 1;
          return previous;
        }, {}),
      };
    case SET_SEARCH_IS_FETCHING_BOOKS:
      return {
        ...state,
        isFetchingBooks: action.payload.isFetchingBooks,
      };
    default:
      return state;
  }
};

export default purchasedSearchReducer;

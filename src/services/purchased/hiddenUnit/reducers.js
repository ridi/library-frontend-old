import { initialState, getKey, initialDataState } from './state';

import {
  CLEAR_SELECTED_HIDDEN_UNIT_BOOKS,
  SET_HIDDEN_UNIT_ID,
  SET_HIDDEN_UNIT_ITEMS,
  SET_HIDDEN_UNIT_PAGE,
  SET_HIDDEN_UNIT_TOTAL_COUNT,
  SELECT_HIDDEN_UNIT_BOOKS,
  TOGGLE_SELECT_HIDDEN_UNIT_BOOK,
  SET_IS_FETCHING_HIDDEN_BOOK,
  SET_HIDDEN_UNIT_PRIMARY_ITEM,
} from './actions';
import { toDict, toFlatten } from '../../../utils/array';

const hiddenUnitReducer = (state = initialState, action) => {
  const key = getKey(state);
  const dataState = state.data[key] || initialDataState;

  switch (action.type) {
    case SET_HIDDEN_UNIT_ITEMS:
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
    case SET_HIDDEN_UNIT_TOTAL_COUNT:
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
    case SET_HIDDEN_UNIT_PAGE:
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

    case SET_HIDDEN_UNIT_PRIMARY_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...dataState,
            primaryItem: action.payload.primaryItem,
          },
        },
      };
    case SET_HIDDEN_UNIT_ID:
      return {
        ...state,
        unitId: action.payload.unitId,
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
    case SET_IS_FETCHING_HIDDEN_BOOK:
      return {
        ...state,
        isFetchingBook: action.payload.isFetchingBook,
      };
    default:
      return state;
  }
};

export default hiddenUnitReducer;

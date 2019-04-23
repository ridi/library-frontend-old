import produce from 'immer';

import { initialState, initialDataState, getKey } from './state';

import {
  START_LOAD_MAIN_ITEMS,
  UPDATE_MAIN_ITEMS,
  CLEAR_SELECTED_MAIN_BOOKS,
  SELECT_MAIN_BOOKS,
  TOGGLE_SELECT_MAIN_BOOK,
  SET_IS_FETCHING_BOOKS,
} from './actions';

import { concat, toDict, toFlatten } from '../../../utils/array';

const mainReducer = produce((draft, action) => {
  const key =
    action.type === START_LOAD_MAIN_ITEMS && action.payload != null
      ? concat([action.payload.filterSelected, action.payload.order])
      : getKey(draft);
  if (draft.data[key] == null) {
    draft.data[key] = initialDataState;
  }

  switch (action.type) {
    case START_LOAD_MAIN_ITEMS:
      if ('page' in action.payload) {
        draft.data[key].page = action.payload.page;
      }
      if ('order' in action.payload) {
        draft.order = action.payload.order;
      }
      if ('filterSelected' in action.payload) {
        draft.filter.selected = action.payload.filterSelected;
      }
      draft.isFetchingBooks = true;
      break;
    case UPDATE_MAIN_ITEMS:
      draft.data[key].items = { ...draft.data[key].items, ...toDict(action.payload.items, 'b_id') };
      draft.data[key].itemIdsForPage[draft.data[key].page] = toFlatten(action.payload.items, 'b_id');
      draft.data[key].unitTotalCount = action.payload.unitTotalCount;
      draft.data[key].itemTotalCount = action.payload.itemTotalCount;
      draft.filter.options = action.payload.filterOptions;
      break;
    case CLEAR_SELECTED_MAIN_BOOKS:
      if (Object.keys(draft.selectedBooks).length !== 0) {
        draft.selectedBooks = {};
      }
      break;
    case TOGGLE_SELECT_MAIN_BOOK:
      const { selectedBooks } = draft;
      if (selectedBooks[action.payload.bookId]) {
        delete selectedBooks[action.payload.bookId];
      } else {
        selectedBooks[action.payload.bookId] = 1;
      }
      break;
    case SELECT_MAIN_BOOKS:
      draft.selectedBooks = action.payload.bookIds.reduce((previous, bookId) => {
        previous[bookId] = 1;
        return previous;
      }, {});
      break;
    case SET_IS_FETCHING_BOOKS:
      draft.isFetchingBooks = action.payload.isFetchingBooks;
      break;
    default:
      break;
  }
}, initialState);

export default mainReducer;

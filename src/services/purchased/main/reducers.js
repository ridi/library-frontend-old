import produce from 'immer';
import { toDict, toFlatten } from '../../../utils/array';
import { LOAD_MAIN_ITEMS, SET_IS_FETCHING_BOOKS, UPDATE_MAIN_ITEMS } from './actions';
import { createInitialDataState, initialState, mapPageOptionsToKey } from './state';

const mainReducer = produce((draft, action) => {
  let key;
  if ([UPDATE_MAIN_ITEMS].includes(action.type)) {
    const { pageOptions } = action.payload;
    key = mapPageOptionsToKey(pageOptions);
    if (draft.data[key] == null) {
      draft.data[key] = createInitialDataState();
    }
  }

  switch (action.type) {
    case LOAD_MAIN_ITEMS:
      draft.isFetchingBooks = true;
      break;
    case UPDATE_MAIN_ITEMS:
      const { page } = action.payload.pageOptions;
      draft.data[key].items = { ...draft.data[key].items, ...toDict(action.payload.items, 'b_id') };
      draft.data[key].itemIdsForPage[page] = toFlatten(action.payload.items, 'b_id');
      draft.data[key].unitTotalCount = action.payload.unitTotalCount;
      draft.data[key].itemTotalCount = action.payload.itemTotalCount;
      draft.filter.options = action.payload.filterOptions;
      break;
    case SET_IS_FETCHING_BOOKS:
      draft.isFetchingBooks = action.payload.isFetchingBooks;
      break;
    default:
      break;
  }
}, initialState);

export default mainReducer;

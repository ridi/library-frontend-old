import produce from 'immer';
import { toDict, toFlatten } from '../../../utils/array';
import { LOAD_SEARCH_ITEMS, SET_SEARCH_ITEMS, SET_SEARCH_TOTAL_COUNT, SET_SEARCH_IS_FETCHING_BOOKS } from './actions';
import { createInitialDataState, initialState, mapPageOptionsToKey } from './state';

const purchasedSearchReducer = produce((draft, action) => {
  let key = '';
  if ([SET_SEARCH_ITEMS, SET_SEARCH_TOTAL_COUNT].includes(action.type)) {
    key = mapPageOptionsToKey(action.payload.pageOptions);
    if (draft.data[key] == null) {
      draft.data[key] = createInitialDataState();
    }
  }
  switch (action.type) {
    case LOAD_SEARCH_ITEMS:
      draft.isFetchingBooks = true;
      break;
    case SET_SEARCH_ITEMS:
      draft.data[key].items = { ...draft.data[key].items, ...toDict(action.payload.items, 'b_id') };
      draft.data[key].itemIdsForPage[action.payload.pageOptions.page] = toFlatten(action.payload.items, 'b_id');
      break;
    case SET_SEARCH_TOTAL_COUNT:
      draft.data[key].unitTotalCount = action.payload.unitTotalCount;
      draft.data[key].itemTotalCount = action.payload.itemTotalCount;
      break;
    case SET_SEARCH_IS_FETCHING_BOOKS:
      draft.isFetchingBooks = action.payload.isFetchingBooks;
      break;
    default:
      break;
  }
}, initialState);

export default purchasedSearchReducer;

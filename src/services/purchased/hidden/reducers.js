import produce from 'immer';
import { toDict, toFlatten } from '../../../utils/array';
import { SET_HIDDEN_ITEMS, SET_HIDDEN_TOTAL_COUNT, SET_HIDDEN_IS_FETCHING_BOOKS } from './actions';
import { initialState } from './state';

const purchasedHiddenReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_HIDDEN_ITEMS:
      draft.items = {
        ...draft.items,
        ...toDict(action.payload.items, 'b_id'),
      };
      draft.itemIdsForPage[action.payload.page] = toFlatten(action.payload.items, 'b_id');
      break;
    case SET_HIDDEN_TOTAL_COUNT:
      draft.unitTotalCount = action.payload.unitTotalCount;
      draft.itemTotalCount = action.payload.itemTotalCount;
      break;
    case SET_HIDDEN_IS_FETCHING_BOOKS:
      draft.isFetchingBooks = action.payload.isFetchingBooks;
      break;
    default:
      break;
  }
}, initialState);

export default purchasedHiddenReducer;

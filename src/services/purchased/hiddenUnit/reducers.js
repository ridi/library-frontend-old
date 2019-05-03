import produce from 'immer';
import { toDict, toFlatten } from '../../../utils/array';
import {
  SET_HIDDEN_UNIT_ID,
  SET_HIDDEN_UNIT_ITEMS,
  SET_HIDDEN_UNIT_PAGE,
  SET_HIDDEN_UNIT_PRIMARY_ITEM,
  SET_HIDDEN_UNIT_TOTAL_COUNT,
  SET_IS_FETCHING_HIDDEN_BOOK,
} from './actions';
import { getKey, initialDataState, initialState } from './state';

const hiddenUnitReducer = produce((draft, action) => {
  const key = getKey(draft);
  if (draft.data[key] == null) {
    draft.data[key] = { ...initialDataState };
  }
  switch (action.type) {
    case SET_HIDDEN_UNIT_ITEMS:
      draft.data[key].items = {
        ...draft.data[key].items,
        ...toDict(action.payload.items, 'b_id'),
      };
      draft.data[key].itemIdsForPage[draft.data[key].page] = toFlatten(action.payload.items, 'b_id');
      break;
    case SET_HIDDEN_UNIT_TOTAL_COUNT:
      draft.data[key].itemTotalCount = action.payload.itemTotalCount;
      break;
    case SET_HIDDEN_UNIT_PAGE:
      draft.data[key].page = action.payload.page;
      break;
    case SET_HIDDEN_UNIT_PRIMARY_ITEM:
      draft.primaryItems[draft.unitId] = action.payload.primaryItem;
      break;
    case SET_HIDDEN_UNIT_ID:
      draft.unitId = action.payload.unitId;
      break;
    case SET_IS_FETCHING_HIDDEN_BOOK:
      draft.isFetchingBook = action.payload.isFetchingBook;
      break;
    default:
      break;
  }
}, initialState);

export default hiddenUnitReducer;

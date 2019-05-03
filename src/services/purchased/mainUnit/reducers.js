import produce from 'immer';
import { toDict, toFlatten } from '../../../utils/array';
import {
  SET_MAIN_UNIT_ID,
  SET_MAIN_UNIT_ITEMS,
  SET_MAIN_UNIT_ORDER,
  SET_MAIN_UNIT_PAGE,
  SET_MAIN_UNIT_TOTAL_COUNT,
  SET_IS_FETCHING_BOOK,
  SET_MAIN_UNIT_PRIMARY_ITEM,
  SET_MAIN_UNIT_PURCHASED_TOTAL_COUNT,
} from './actions';
import { initialState, initialDataState, getKey } from './state';

const purchasedMainUnitReducer = produce((draft, action) => {
  const key = getKey(draft);
  if (draft.data[key] == null) {
    draft.data[key] = { ...initialDataState };
  }

  switch (action.type) {
    case SET_MAIN_UNIT_ITEMS:
      draft.data[key].items = { ...draft.data[key].items, ...toDict(action.payload.items, 'b_id') };
      draft.data[key].itemIdsForPage[draft.data[key].page] = toFlatten(action.payload.items, 'b_id');
      break;
    case SET_MAIN_UNIT_TOTAL_COUNT:
      draft.data[key].itemTotalCount = action.payload.itemTotalCount;
      break;
    case SET_MAIN_UNIT_PAGE:
      draft.data[key].page = action.payload.page;
      break;
    case SET_MAIN_UNIT_PRIMARY_ITEM:
      draft.primaryItems[draft.unitId] = action.payload.primaryItem;
      break;
    case SET_MAIN_UNIT_PURCHASED_TOTAL_COUNT:
      draft.data[key].purchasedTotalCount = action.payload.purchasedTotalCount;
      break;
    case SET_MAIN_UNIT_ID:
      draft.unitId = action.payload.unitId;
      break;
    case SET_MAIN_UNIT_ORDER:
      draft.order = action.payload.order;
      break;
    case SET_IS_FETCHING_BOOK:
      draft.isFetchingBook = action.payload.isFetchingBook;
      break;
    default:
      break;
  }
}, initialState);

export default purchasedMainUnitReducer;

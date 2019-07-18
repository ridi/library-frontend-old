import produce from 'immer';
import { OrderOptions } from '../../constants/orderOptions';
import { concat, toDict, toFlatten } from '../../utils/array';
import {
  LOAD_UNIT_ITEMS,
  SET_UNIT_ITEMS,
  SET_UNIT_TOTAL_COUNT,
  SET_IS_FETCHING_BOOK,
  SET_UNIT_PRIMARY_ITEM,
  SET_UNIT_PURCHASED_TOTAL_COUNT,
} from './actions';
import { createInitialDataState, initialState } from './state';

const unitPageReducer = produce((draft, action) => {
  let key = '';
  if ([SET_UNIT_ITEMS, SET_UNIT_TOTAL_COUNT, SET_UNIT_PURCHASED_TOTAL_COUNT].includes(action.type)) {
    const order = OrderOptions.toKey(action.payload.orderType, action.payload.orderBy);
    key = concat([action.payload.unitId, order]);
    if (draft.data[key] == null) {
      draft.data[key] = createInitialDataState();
    }
  }

  switch (action.type) {
    case LOAD_UNIT_ITEMS:
      draft.isFetchingBook = true;
      break;
    case SET_UNIT_ITEMS:
      draft.data[key].items = { ...draft.data[key].items, ...toDict(action.payload.items, 'b_id') };
      draft.data[key].itemIdsForPage[action.payload.page] = toFlatten(action.payload.items, 'b_id');
      break;
    case SET_UNIT_TOTAL_COUNT:
      draft.data[key].itemTotalCount = action.payload.itemTotalCount;
      break;
    case SET_UNIT_PRIMARY_ITEM:
      draft.primaryItems[action.payload.unitId] = action.payload.primaryItem;
      break;
    case SET_UNIT_PURCHASED_TOTAL_COUNT:
      draft.data[key].purchasedTotalCount = action.payload.purchasedTotalCount;
      break;
    case SET_IS_FETCHING_BOOK:
      draft.isFetchingBook = action.payload.isFetchingBook;
      break;
    default:
      break;
  }
}, initialState);

export default unitPageReducer;

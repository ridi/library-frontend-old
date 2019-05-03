import produce from 'immer';
import { toDict, toFlatten } from '../../../utils/array';
import {
  SET_IS_FETCHING_SEARCH_BOOK,
  SET_SEARCH_UNIT_ID,
  SET_SEARCH_UNIT_ITEMS,
  SET_SEARCH_UNIT_KEYWORD,
  SET_SEARCH_UNIT_ORDER,
  SET_SEARCH_UNIT_PAGE,
  SET_SEARCH_UNIT_PRIMARY_ITEM,
  SET_SEARCH_UNIT_PURCHASED_TOTAL_COUNT,
  SET_SEARCH_UNIT_TOTAL_COUNT,
} from './actions';
import { getKey, initialDataState, initialState } from './state';

const searchUnitReducer = produce((draft, action) => {
  const key = getKey(draft);
  if (draft.data[key] == null) {
    draft.data[key] = { ...initialDataState };
  }
  switch (action.type) {
    case SET_SEARCH_UNIT_ITEMS:
      draft.data[key].items = { ...draft.data[key].items, ...toDict(action.payload.items, 'b_id') };
      draft.data[key].itemIdsForPage[draft.data[key].page] = toFlatten(action.payload.items, 'b_id');
      break;
    case SET_SEARCH_UNIT_TOTAL_COUNT:
      draft.data[key].itemTotalCount = action.payload.itemTotalCount;
      break;
    case SET_SEARCH_UNIT_ID:
      draft.unitId = action.payload.unitId;
      break;
    case SET_SEARCH_UNIT_PAGE:
      draft.data[key].page = action.payload.page;
      break;
    case SET_SEARCH_UNIT_PRIMARY_ITEM:
      draft.primaryItems[draft.unitId] = action.payload.primaryItem;
      break;
    case SET_SEARCH_UNIT_PURCHASED_TOTAL_COUNT:
      draft.data[key].purchasedTotalCount = action.payload.purchasedTotalCount;
      break;
    case SET_SEARCH_UNIT_ORDER:
      draft.order = action.payload.order;
      break;
    case SET_SEARCH_UNIT_KEYWORD:
      draft.keyword = action.payload.keyword;
      break;
    case SET_IS_FETCHING_SEARCH_BOOK:
      draft.isFetchingBook = action.payload.isFetchingBook;
      break;
    default:
      break;
  }
}, initialState);

export default searchUnitReducer;

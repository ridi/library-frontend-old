import produce from 'immer';
import { OrderOptions } from '../../../constants/orderOptions';
import { concat, toDict, toFlatten } from '../../../utils/array';
import { LOAD_MAIN_ITEMS, SET_IS_FETCHING_BOOKS, UPDATE_MAIN_ITEMS } from './actions';
import { getKey, initialDataState, initialState } from './state';

const mainReducer = produce((draft, action) => {
  let key = getKey(draft);
  if (draft.data[key] == null) {
    draft.data[key] = { ...initialDataState };
  }

  switch (action.type) {
    case LOAD_MAIN_ITEMS: {
      const { currentPage, orderType, orderBy, categoryFilter } = action.payload;
      const order = OrderOptions.toKey(orderType, orderBy);
      key = concat([categoryFilter, order]);
      if (draft.data[key] == null) {
        draft.data[key] = { ...initialDataState };
      }

      draft.data[key].page = currentPage;
      draft.order = order;
      draft.filter.selected = categoryFilter;
      draft.isFetchingBooks = true;
      break;
    }
    case UPDATE_MAIN_ITEMS:
      draft.data[key].items = { ...draft.data[key].items, ...toDict(action.payload.items, 'b_id') };
      draft.data[key].itemIdsForPage[draft.data[key].page] = toFlatten(action.payload.items, 'b_id');
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

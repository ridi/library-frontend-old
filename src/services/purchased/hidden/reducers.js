import { initialState } from './state';
import { SET_PURCHASED_HIDDEN_ITEMS, SET_PURCHASED_HIDDEN_TOTAL_COUNT, SET_PURCHASED_HIDDEN_PAGE } from './actions';

import { toDict, toFlatten } from '../../../utils/array';

const purchasedHiddenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASED_HIDDEN_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          ...toDict(action.payload.items, 'b_id'),
        },
        itemIdsForPage: {
          ...state.itemIdsForPage,
          [state.page]: toFlatten(action.payload.items, 'b_id'),
        },
      };
    case SET_PURCHASED_HIDDEN_TOTAL_COUNT:
      return {
        ...state,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_PURCHASED_HIDDEN_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    default:
      return state;
  }
};

export default purchasedHiddenReducer;

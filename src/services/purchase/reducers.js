import { initialState } from './state';

import {
  SET_PURCHASE_ITEMS,
  SET_PURCHASE_TOTAL_COUNT,
  CHANGE_PURCHASE_PAGE,
  CHANGE_PURCHASE_OPTION,
} from './actions';

import { toDict, toFlatten } from '../../utils/array';

const purchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASE_ITEMS:
      return {
        ...state,
        itemsIds: {
          ...state.itemIds,
          [state.page]: toFlatten(action.payload.items, 'unit_id'),
        },
        items: {
          ...state.items,
          ...toDict(action.payload.items, 'unit_id'),
        },
      };
    case SET_PURCHASE_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case CHANGE_PURCHASE_OPTION:
      return {
        ...state,
        options: {
          ...state.options,
          [action.payload.key]: action.payload.value,
        },
        page: 1,
      };
    case CHANGE_PURCHASE_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    default:
      return state;
  }
};

export default purchaseReducer;

import { initialState } from './state';

import {
  SET_PURCHASE_ITEMS,
  SET_PURCHASE_TOTAL_COUNT,
  SET_PURCHASE_PAGE,
  SET_PURCHASE_ORDER,
  SET_PURCHASE_FILTER,
} from './actions';

const purchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASE_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          [state.page]: action.payload.items,
        },
      };
    case SET_PURCHASE_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_PURCHASE_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case SET_PURCHASE_ORDER:
      return {
        ...state,
        order: state.payload.order,
      };
    case SET_PURCHASE_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          selected: state.payload.filter,
        },
      };
    default:
      return state;
  }
};

export default purchaseReducer;

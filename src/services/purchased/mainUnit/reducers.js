import { initialState } from './state';

import {
  SET_PURCHASED_UNIT_ITEMS,
  SET_PURCHASED_UNIT_TOTAL_COUNT,
  SET_PURCHASED_UNIT_PAGE,
  SET_PURCHASED_UNIT_ORDER,
  SET_PURCHASED_UNIT_FILTER,
  SET_PURCHASED_UNIT_FILTER_OPTIONS,
  SET_PURCHASED_UNIT_ID,
} from './actions';

const purchasedUnitReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASED_UNIT_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          [state.page]: action.payload.items,
        },
      };
    case SET_PURCHASED_UNIT_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_PURCHASED_UNIT_ID:
      return {
        ...state,
        unitId: action.payload.unitId,
      };
    case SET_PURCHASED_UNIT_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case SET_PURCHASED_UNIT_ORDER:
      return {
        ...state,
        order: action.payload.order,
      };
    case SET_PURCHASED_UNIT_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          selected: action.payload.filter,
        },
      };
    case SET_PURCHASED_UNIT_FILTER_OPTIONS:
      return {
        ...state,
        filter: {
          ...state.filter,
          options: action.payload.options,
        },
      };
    default:
      return state;
  }
};

export default purchasedUnitReducer;

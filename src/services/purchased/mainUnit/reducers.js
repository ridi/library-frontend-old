import { initialState } from './state';

import {
  SET_MAIN_UNIT_ITEMS,
  SET_MAIN_UNIT_TOTAL_COUNT,
  SET_MAIN_UNIT_PAGE,
  SET_MAIN_UNIT_ORDER,
  SET_MAIN_UNIT_FILTER,
  SET_MAIN_UNIT_FILTER_OPTIONS,
  SET_MAIN_UNIT_ID,
} from './actions';

const mainUnitReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAIN_UNIT_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          [state.page]: action.payload.items,
        },
      };
    case SET_MAIN_UNIT_TOTAL_COUNT:
      return {
        ...state,
        unitTotalCount: action.payload.unitTotalCount,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_MAIN_UNIT_ID:
      return {
        ...state,
        unitId: action.payload.unitId,
      };
    case SET_MAIN_UNIT_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case SET_MAIN_UNIT_ORDER:
      return {
        ...state,
        order: action.payload.order,
      };
    case SET_MAIN_UNIT_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          selected: action.payload.filter,
        },
      };
    case SET_MAIN_UNIT_FILTER_OPTIONS:
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

export default mainUnitReducer;

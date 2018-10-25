import { initialState } from './state';

import {
  SET_PURCHASE_ITEMS,
  CHANGE_PURCHASE_PAGE,
  CHANGE_PURCHASE_OPTION,
} from './actions';

const purchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASE_ITEMS:
      return {
        ...state,
        items: action.payload.items,
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

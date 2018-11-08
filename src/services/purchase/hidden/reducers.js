import { initialState } from './state';
import { SET_PURCHASE_HIDDEN_ITEMS, SET_PURCHASE_HIDDEN_TOTAL_COUNT, SET_PURCHASE_HIDDEN_PAGE } from './actions';

const purchaseHiddenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASE_HIDDEN_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          [state.page]: action.payload.items,
        },
      };
    case SET_PURCHASE_HIDDEN_TOTAL_COUNT:
      return {
        ...state,
        itemTotalCount: action.payload.itemTotalCount,
      };
    case SET_PURCHASE_HIDDEN_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    default:
      return state;
  }
};

export default purchaseHiddenReducer;

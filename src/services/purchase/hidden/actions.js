export const LOAD_PURCHASE_HIDDEN_ITEMS = 'LOAD_PURCHASE_HIDDEN_ITEMS';

export const SET_PURCHASE_HIDDEN_ITEMS = 'SET_PURCHASE_HIDDEN_ITEMS';
export const SET_PURCHASE_HIDDEN_TOTAL_COUNT = 'SET_PURCHASE_HIDDEN_TOTAL_COUNT';
export const SET_PURCHASE_HIDDEN_PAGE = 'SET_PURCHASE_HIDDEN_PAGE';

export const loadPurchaseHiddenItems = () => ({
  type: LOAD_PURCHASE_HIDDEN_ITEMS,
});

export const setPurchaseHiddenItems = items => ({
  type: SET_PURCHASE_HIDDEN_ITEMS,
  payload: {
    items,
  },
});

export const setPurchaseHiddenTotalCount = itemTotalCount => ({
  type: SET_PURCHASE_HIDDEN_TOTAL_COUNT,
  payload: {
    itemTotalCount,
  },
});

export const setPurchaseHiddenPage = page => ({
  type: SET_PURCHASE_HIDDEN_PAGE,
  payload: {
    page,
  },
});

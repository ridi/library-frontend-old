export const LOAD_PURCHASED_HIDDEN_ITEMS = 'LOAD_PURCHASED_HIDDEN_ITEMS';

export const SET_PURCHASED_HIDDEN_ITEMS = 'SET_PURCHASED_HIDDEN_ITEMS';
export const SET_PURCHASED_HIDDEN_TOTAL_COUNT = 'SET_PURCHASED_HIDDEN_TOTAL_COUNT';
export const SET_PURCHASED_HIDDEN_PAGE = 'SET_PURCHASED_HIDDEN_PAGE';

export const loadPurchasedHiddenItems = () => ({
  type: LOAD_PURCHASED_HIDDEN_ITEMS,
});

export const setPurchasedHiddenItems = items => ({
  type: SET_PURCHASED_HIDDEN_ITEMS,
  payload: {
    items,
  },
});

export const setPurchasedHiddenTotalCount = itemTotalCount => ({
  type: SET_PURCHASED_HIDDEN_TOTAL_COUNT,
  payload: {
    itemTotalCount,
  },
});

export const setPurchasedHiddenPage = page => ({
  type: SET_PURCHASED_HIDDEN_PAGE,
  payload: {
    page,
  },
});

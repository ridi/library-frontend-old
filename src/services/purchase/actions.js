export const LOAD_PURCHASE_ITEMS = 'LOAD_PURCHASE_ITEMS';

export const SET_PURCHASE_ITEMS = 'SET_PURCHASE_ITEMS';
export const SET_PURCHASE_TOTAL_COUNT = 'SET_PURCHASE_TOTAL_COUNT';
export const SET_PURCHASE_PAGE = 'SET_PURCHASE_PAGE';
export const SET_PURCHASE_OPTION = 'SET_PURCHASE_OPTION';

export const loadPurchaseItems = () => ({
  type: LOAD_PURCHASE_ITEMS,
});

export const setPurchaseItems = items => ({
  type: SET_PURCHASE_ITEMS,
  payload: {
    items,
  },
});

export const setPurchaseTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_PURCHASE_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setPurchasePage = page => ({
  type: SET_PURCHASE_PAGE,
  payload: {
    page,
  },
});

export const setPurchaseOption = (key, value) => ({
  type: SET_PURCHASE_OPTION,
  payload: {
    key,
    value,
  },
});

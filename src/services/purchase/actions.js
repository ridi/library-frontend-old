export const LOAD_PURCHASE_ITEMS = 'LOAD_PURCHASE_ITEMS';

export const SET_PURCHASE_ITEMS = 'SET_PURCHASE_ITEMS';
export const SET_PURCHASE_TOTAL_COUNT = 'SET_PURCHASE_TOTAL_COUNT';
export const SET_PURCHASE_PAGE = 'SET_PURCHASE_PAGE';
export const SET_PURCHASE_ORDER = 'SET_PURCHASE_ORDER';
export const SET_PURCHASE_FILTER = 'SET_PURCHASE_FILTER';

export const CHANGE_PURCHASE_ORDER = 'CHANGE_PURCHASE_ORDER';

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

export const setPurchaseOrder = order => ({
  type: SET_PURCHASE_ORDER,
  payload: {
    order,
  },
});

export const setPurchaseFilter = filter => ({
  type: SET_PURCHASE_FILTER,
  payload: {
    filter,
  },
});

export const changePurchaseOrder = order => ({
  type: CHANGE_PURCHASE_ORDER,
  payload: {
    order,
  },
});

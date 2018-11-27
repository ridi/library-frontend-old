export const LOAD_PURCHASE_ITEMS = 'LOAD_PURCHASE_ITEMS';

export const SET_PURCHASE_ITEMS = 'SET_PURCHASE_ITEMS';
export const SET_PURCHASE_TOTAL_COUNT = 'SET_PURCHASE_TOTAL_COUNT';
export const SET_PURCHASE_PAGE = 'SET_PURCHASE_PAGE';
export const SET_PURCHASE_ORDER = 'SET_PURCHASE_ORDER';
export const SET_PURCHASE_FILTER = 'SET_PURCHASE_FILTER';
export const SET_PURCHASE_FILTER_OPTIONS = 'SET_PURCHASE_FILTER_OPTIONS';

export const CHANGE_PURCHASE_OPTION = 'CHANGE_PURCHASE_OPTION';

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

export const setPurchaseFilterOptions = options => ({
  type: SET_PURCHASE_FILTER_OPTIONS,
  payload: {
    options,
  },
});

const changePurchaseOption = (key, value) => ({
  type: CHANGE_PURCHASE_OPTION,
  payload: {
    key,
    value,
  },
});

export const changePurchaseOrder = order => changePurchaseOption('order', order);
export const changePurchaseFilter = filter => changePurchaseOption('filter', filter);
export const changePurchasePage = page => changePurchaseOption('page', page);

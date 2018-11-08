export const LOAD_PURCHASED_UNIT_ITEMS = 'LOAD_PURCHASED_UNIT_ITEMS';

export const SET_PURCHASED_UNIT_ITEMS = 'SET_PURCHASED_UNIT_ITEMS';
export const SET_PURCHASED_UNIT_TOTAL_COUNT = 'SET_PURCHASED_UNIT_TOTAL_COUNT';
export const SET_PURCHASED_UNIT_ID = 'SET_PURCHASED_UNIT_ID';
export const SET_PURCHASED_UNIT_PAGE = 'SET_PURCHASED_UNIT_PAGE';
export const SET_PURCHASED_UNIT_ORDER = 'SET_PURCHASED_UNIT_ORDER';
export const SET_PURCHASED_UNIT_FILTER = 'SET_PURCHASED_UNIT_FILTER';
export const SET_PURCHASED_UNIT_FILTER_OPTIONS = 'SET_PURCHASED_UNIT_FILTER_OPTIONS';

export const CHANGE_PURCHASED_UNIT_OPTION = 'CHANGE_PURCHASED_UNIT_OPTION';

export const loadPurchasedUnitItems = () => ({
  type: LOAD_PURCHASED_UNIT_ITEMS,
});

export const setPurchasedUnitItems = items => ({
  type: SET_PURCHASED_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setPurchasedUnitTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_PURCHASED_UNIT_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setPurchasedUnitId = unitId => ({
  type: SET_PURCHASED_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setPurchasedUnitPage = page => ({
  type: SET_PURCHASED_UNIT_PAGE,
  payload: {
    page,
  },
});

export const setPurchasedUnitOrder = order => ({
  type: SET_PURCHASED_UNIT_ORDER,
  payload: {
    order,
  },
});

export const setPurchasedUnitFilter = filter => ({
  type: SET_PURCHASED_UNIT_FILTER,
  payload: {
    filter,
  },
});

export const setPurchasedUnitFilterOptions = options => ({
  type: SET_PURCHASED_UNIT_FILTER_OPTIONS,
  payload: {
    options,
  },
});

const changePurchasedUnitOption = (key, value) => ({
  type: CHANGE_PURCHASED_UNIT_OPTION,
  payload: {
    key,
    value,
  },
});

export const changePurchasedUnitOrder = order => changePurchasedUnitOption('order', order);
export const changePurchasedUnitFilter = filter => changePurchasedUnitOption('filter', filter);

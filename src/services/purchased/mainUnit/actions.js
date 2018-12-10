export const LOAD_MAIN_UNIT_ITEMS = 'LOAD_MAIN_UNIT_ITEMS';

export const SET_MAIN_UNIT_ITEMS = 'SET_MAIN_UNIT_ITEMS';
export const SET_MAIN_UNIT_TOTAL_COUNT = 'SET_MAIN_UNIT_TOTAL_COUNT';
export const SET_MAIN_UNIT_ID = 'SET_MAIN_UNIT_ID';
export const SET_MAIN_UNIT_PAGE = 'SET_MAIN_UNIT_PAGE';
export const SET_MAIN_UNIT_ORDER = 'SET_MAIN_UNIT_ORDER';
export const SET_MAIN_UNIT_FILTER = 'SET_MAIN_UNIT_FILTER';
export const SET_MAIN_UNIT_FILTER_OPTIONS = 'SET_MAIN_UNIT_FILTER_OPTIONS';

export const CHANGE_MAIN_UNIT_OPTION = 'CHANGE_MAIN_UNIT_OPTION';

export const loadMainUnitItems = () => ({
  type: LOAD_MAIN_UNIT_ITEMS,
});

export const setMainUnitItems = items => ({
  type: SET_MAIN_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setMainUnitTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_MAIN_UNIT_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setMainUnitId = unitId => ({
  type: SET_MAIN_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setMainUnitPage = page => ({
  type: SET_MAIN_UNIT_PAGE,
  payload: {
    page,
  },
});

export const setMainUnitOrder = order => ({
  type: SET_MAIN_UNIT_ORDER,
  payload: {
    order,
  },
});

export const setMainUnitFilter = filter => ({
  type: SET_MAIN_UNIT_FILTER,
  payload: {
    filter,
  },
});

export const setMainUnitFilterOptions = options => ({
  type: SET_MAIN_UNIT_FILTER_OPTIONS,
  payload: {
    options,
  },
});

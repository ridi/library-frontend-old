export const LOAD_MAIN_UNIT_ITEMS = 'LOAD_MAIN_UNIT_ITEMS';

export const SET_MAIN_UNIT_ITEMS = 'SET_MAIN_UNIT_ITEMS';
export const SET_MAIN_UNIT_TOTAL_COUNT = 'SET_MAIN_UNIT_TOTAL_COUNT';
export const SET_MAIN_UNIT_ID = 'SET_MAIN_UNIT_ID';
export const SET_MAIN_UNIT_PAGE = 'SET_MAIN_UNIT_PAGE';
export const SET_MAIN_UNIT_ORDER = 'SET_MAIN_UNIT_ORDER';
export const SET_MAIN_UNIT_FILTER = 'SET_MAIN_UNIT_FILTER';
export const SET_MAIN_UNIT_FILTER_OPTIONS = 'SET_MAIN_UNIT_FILTER_OPTIONS';

export const SELECT_ALL_MAIN_UNIT_BOOKS = 'SELECT_ALL_MAIN_UNIT_BOOKS ';
export const CLEAR_SELECTED_MAIN_UNIT_BOOKS = 'CLEAR_SELECTED_MAIN_UNIT_BOOKS';
export const TOGGLE_SELECT_MAIN_UNIT_BOOK = 'TOGGLE_SELECT_MAIN_UNIT_BOOK';
export const SET_SELECT_MAIN_UNIT_BOOKS = 'SET_SELECT_MAIN_UNIT_BOOKS';

export const HIDE_SELECTED_MAIN_UNIT_BOOKS = 'HIDE_SELECTED_MAIN_UNIT_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS = 'DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS';

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

export const selectAllMainUnitBooks = () => ({
  type: SELECT_ALL_MAIN_UNIT_BOOKS,
});

export const clearSelectedMainUnitBooks = () => ({
  type: CLEAR_SELECTED_MAIN_UNIT_BOOKS,
});

export const toggleSelectMainUnitBook = bookId => ({
  type: TOGGLE_SELECT_MAIN_UNIT_BOOK,
  payload: {
    bookId,
  },
});

export const setSelectMainUnitBooks = bookIds => ({
  type: SET_SELECT_MAIN_UNIT_BOOKS,
  payload: {
    bookIds,
  },
});

export const hideSelectedMainUnitBooks = () => ({
  type: HIDE_SELECTED_MAIN_UNIT_BOOKS,
});

export const downloadSelectedMainUnitBooks = () => ({
  type: DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS,
});

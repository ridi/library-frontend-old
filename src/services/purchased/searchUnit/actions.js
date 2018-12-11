export const LOAD_SEARCH_UNIT_ITEMS = 'LOAD_SEARCH_UNIT_ITEMS';

export const SET_SEARCH_UNIT_ITEMS = 'SET_SEARCH_UNIT_ITEMS';
export const SET_SEARCH_UNIT_TOTAL_COUNT = 'SET_SEARCH_UNIT_TOTAL_COUNT';
export const SET_SEARCH_UNIT_ID = 'SET_SEARCH_UNIT_ID';
export const SET_SEARCH_UNIT_PAGE = 'SET_SEARCH_UNIT_PAGE';
export const SET_SEARCH_UNIT_ORDER = 'SET_SEARCH_UNIT_ORDER';
export const SET_SEARCH_UNIT_FILTER = 'SET_SEARCH_UNIT_FILTER';
export const SET_SEARCH_UNIT_FILTER_OPTIONS = 'SET_SEARCH_UNIT_FILTER_OPTIONS';

export const SELECT_ALL_SEARCH_UNIT_BOOKS = 'SELECT_ALL_SEARCH_UNIT_BOOKS ';
export const CLEAR_SELECTED_SEARCH_UNIT_BOOKS = 'CLEAR_SELECTED_SEARCH_UNIT_BOOKS';
export const TOGGLE_SELECT_SEARCH_UNIT_BOOK = 'TOGGLE_SELECT_SEARCH_UNIT_BOOK';
export const SET_SELECT_SEARCH_UNIT_BOOKS = 'SET_SELECT_SEARCH_UNIT_BOOKS';

export const HIDE_SELECTED_SEARCH_UNIT_BOOKS = 'HIDE_SELECTED_SEARCH_UNIT_BOOKS';
export const DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS = 'DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS';

export const loadSearchUnitItems = () => ({
  type: LOAD_SEARCH_UNIT_ITEMS,
});

export const setSearchUnitItems = items => ({
  type: SET_SEARCH_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setSearchUnitTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_SEARCH_UNIT_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setSearchUnitId = unitId => ({
  type: SET_SEARCH_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setSearchUnitPage = page => ({
  type: SET_SEARCH_UNIT_PAGE,
  payload: {
    page,
  },
});

export const setSearchUnitOrder = order => ({
  type: SET_SEARCH_UNIT_ORDER,
  payload: {
    order,
  },
});

export const setSearchUnitFilter = filter => ({
  type: SET_SEARCH_UNIT_FILTER,
  payload: {
    filter,
  },
});

export const setSearchUnitFilterOptions = options => ({
  type: SET_SEARCH_UNIT_FILTER_OPTIONS,
  payload: {
    options,
  },
});

export const selectAllSearchUnitBooks = () => ({
  type: SELECT_ALL_SEARCH_UNIT_BOOKS,
});

export const clearSelectedSearchUnitBooks = () => ({
  type: CLEAR_SELECTED_SEARCH_UNIT_BOOKS,
});

export const toggleSelectSearchUnitBook = bookId => ({
  type: TOGGLE_SELECT_SEARCH_UNIT_BOOK,
  payload: {
    bookId,
  },
});

export const setSelectSearchUnitBooks = bookIds => ({
  type: SET_SELECT_SEARCH_UNIT_BOOKS,
  payload: {
    bookIds,
  },
});

export const hideSelectedSearchUnitBooks = () => ({
  type: HIDE_SELECTED_SEARCH_UNIT_BOOKS,
});

export const downloadSelectedSearchUnitBooks = () => ({
  type: DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS,
});

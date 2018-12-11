export const LOAD_MAIN_ITEMS = 'LOAD_MAIN_ITEMS';

export const SET_MAIN_ITEMS = 'SET_MAIN_ITEMS';
export const SET_MAIN_TOTAL_COUNT = 'SET_MAIN_TOTAL_COUNT';
export const SET_MAIN_PAGE = 'SET_MAIN_PAGE';
export const SET_MAIN_ORDER = 'SET_MAIN_ORDER';
export const SET_MAIN_FILTER = 'SET_MAIN_FILTER';
export const SET_MAIN_FILTER_OPTIONS = 'SET_MAIN_FILTER_OPTIONS';

export const SELECT_ALL_MAIN_BOOKS = 'SELECT_ALL_MAIN_BOOKS';
export const CLEAR_SELECTED_MAIN_BOOKS = 'CLEAR_SELECTED_MAIN_BOOKS';
export const TOGGLE_SELECT_MAIN_BOOK = 'TOGGLE_SELECT_MAIN_BOOK';
export const SET_SELECT_MAIN_BOOKS = 'SET_SELECT_MAIN_BOOKS';

export const HIDE_SELECTED_MAIN_BOOKS = 'HIDE_SELECTED_MAIN_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_BOOKS = 'DOWNLOAD_SELECTED_MAIN_BOOKS';

export const loadMainItems = () => ({
  type: LOAD_MAIN_ITEMS,
});

export const setMainItems = items => ({
  type: SET_MAIN_ITEMS,
  payload: {
    items,
  },
});

export const setMainTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_MAIN_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setMainPage = page => ({
  type: SET_MAIN_PAGE,
  payload: {
    page,
  },
});

export const setMainOrder = order => ({
  type: SET_MAIN_ORDER,
  payload: {
    order,
  },
});

export const setMainFilter = filter => ({
  type: SET_MAIN_FILTER,
  payload: {
    filter,
  },
});

export const setMainFilterOptions = options => ({
  type: SET_MAIN_FILTER_OPTIONS,
  payload: {
    options,
  },
});

export const selectAllMainBooks = () => ({
  type: SELECT_ALL_MAIN_BOOKS,
});

export const clearSelectedMainBooks = () => ({
  type: CLEAR_SELECTED_MAIN_BOOKS,
});

export const toggleSelectMainBook = bookId => ({
  type: TOGGLE_SELECT_MAIN_BOOK,
  payload: {
    bookId,
  },
});

export const setSelectMainBooks = bookIds => ({
  type: SET_SELECT_MAIN_BOOKS,
  payload: {
    bookIds,
  },
});

export const hideSelectedMainBooks = () => ({
  type: HIDE_SELECTED_MAIN_BOOKS,
});

export const downloadSelectedMainBooks = () => ({
  type: DOWNLOAD_SELECTED_MAIN_BOOKS,
});

export const LOAD_MAIN_ITEMS = 'LOAD_MAIN_ITEMS';

export const UPDATE_MAIN_ITEMS = 'UPDATE_MAIN_ITEMS';
export const UPDATE_MAIN_OPTIONS = 'UPDATE_MAIN_OPTIONS';

export const SELECT_ALL_MAIN_BOOKS = 'SELECT_ALL_MAIN_BOOKS';
export const HIDE_SELECTED_MAIN_BOOKS = 'HIDE_SELECTED_MAIN_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_BOOKS = 'DOWNLOAD_SELECTED_MAIN_BOOKS';

export const SET_IS_FETCHING_BOOKS = 'SET_IS_FETCHING_BOOKS';

export const loadItems = (pageOptions, isServer = false) => ({
  type: LOAD_MAIN_ITEMS,
  payload: {
    pageOptions,
    isServer,
  },
});

export const updateItems = ({ pageOptions, items, unitTotalCount, itemTotalCount, filterOptions }) => ({
  type: UPDATE_MAIN_ITEMS,
  payload: {
    pageOptions,
    items,
    unitTotalCount,
    itemTotalCount,
    filterOptions,
  },
});

export const selectAllBooks = pageOptions => ({
  type: SELECT_ALL_MAIN_BOOKS,
  payload: {
    pageOptions,
  },
});

export const hideSelectedBooks = pageOptions => ({
  type: HIDE_SELECTED_MAIN_BOOKS,
  payload: {
    pageOptions,
  },
});

export const downloadSelectedBooks = pageOptions => ({
  type: DOWNLOAD_SELECTED_MAIN_BOOKS,
  payload: {
    pageOptions,
  },
});

export const setIsFetchingBooks = isFetchingBooks => ({
  type: SET_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

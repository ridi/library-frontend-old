export const LOAD_MAIN_ITEMS = 'LOAD_MAIN_ITEMS';

export const UPDATE_MAIN_ITEMS = 'UPDATE_MAIN_ITEMS';

export const SELECT_ALL_MAIN_BOOKS = 'SELECT_ALL_MAIN_BOOKS';
export const HIDE_SELECTED_MAIN_BOOKS = 'HIDE_SELECTED_MAIN_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_BOOKS = 'DOWNLOAD_SELECTED_MAIN_BOOKS';

export const SET_MAIN_IS_FETCHING_BOOKS = 'SET_MAIN_IS_FETCHING_BOOKS';

export const loadItems = pageOptions => ({
  type: LOAD_MAIN_ITEMS,
  payload: {
    pageOptions,
  },
});

export const updateItems = ({ pageOptions, items, unitTotalCount, itemTotalCount }) => ({
  type: UPDATE_MAIN_ITEMS,
  payload: {
    pageOptions,
    items,
    unitTotalCount,
    itemTotalCount,
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

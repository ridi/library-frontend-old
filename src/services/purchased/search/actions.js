export const LOAD_SEARCH_ITEMS = 'LOAD_SEARCH_ITEMS';

export const SET_SEARCH_ITEMS = 'SET_SEARCH_ITEMS';
export const SET_SEARCH_TOTAL_COUNT = 'SET_SEARCH_TOTAL_COUNT';

export const SELECT_ALL_SEARCH_BOOKS = 'SELECT_ALL_SEARCH_BOOKS';
export const HIDE_SELECTED_SEARCH_BOOKS = 'HIDE_SELECTED_SEARCH_BOOKS';
export const DOWNLOAD_SELECTED_SEARCH_BOOKS = 'DOWNLOAD_SELECTED_SEARCH_BOOKS';

export const SET_SEARCH_IS_FETCHING_BOOKS = 'SET_SEARCH_IS_FETCHING_BOOKS';

export const loadItems = pageOptions => ({
  type: LOAD_SEARCH_ITEMS,
  payload: {
    pageOptions,
  },
});

export const setItems = (items, pageOptions) => ({
  type: SET_SEARCH_ITEMS,
  payload: {
    items,
    pageOptions,
  },
});

export const setTotalCount = (unitTotalCount, itemTotalCount, pageOptions) => ({
  type: SET_SEARCH_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
    pageOptions,
  },
});

export const selectAllBooks = pageOptions => ({
  type: SELECT_ALL_SEARCH_BOOKS,
  payload: {
    pageOptions,
  },
});

export const hideSelectedBooks = pageOptions => ({
  type: HIDE_SELECTED_SEARCH_BOOKS,
  payload: {
    pageOptions,
  },
});

export const downloadSelectedBooks = pageOptions => ({
  type: DOWNLOAD_SELECTED_SEARCH_BOOKS,
  payload: {
    pageOptions,
  },
});

export const setSearchIsFetchingBooks = isFetchingBooks => ({
  type: SET_SEARCH_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

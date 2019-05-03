export const LOAD_SEARCH_ITEMS = 'LOAD_SEARCH_ITEMS';

export const SET_SEARCH_ITEMS = 'SET_SEARCH_ITEMS';
export const SET_SEARCH_TOTAL_COUNT = 'SET_SEARCH_TOTAL_COUNT';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';

export const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';
export const CHANGE_SEARCH_KEYWORD = 'CHANGE_SEARCH_KEYWORD';

export const SELECT_ALL_SEARCH_BOOKS = 'SELECT_ALL_SEARCH_BOOKS';
export const HIDE_SELECTED_SEARCH_BOOKS = 'HIDE_SELECTED_SEARCH_BOOKS';
export const DOWNLOAD_SELECTED_SEARCH_BOOKS = 'DOWNLOAD_SELECTED_SEARCH_BOOKS';

export const SET_SEARCH_IS_FETCHING_BOOKS = 'SET_SEARCH_IS_FETCHING_BOOKS';

export const loadItems = () => ({
  type: LOAD_SEARCH_ITEMS,
});

export const setItems = items => ({
  type: SET_SEARCH_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_SEARCH_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setPage = page => ({
  type: SET_SEARCH_PAGE,
  payload: {
    page,
  },
});

export const setSearchKeyword = keyword => ({
  type: SET_SEARCH_KEYWORD,
  payload: {
    keyword,
  },
});

export const changeSearchKeyword = keyword => ({
  type: CHANGE_SEARCH_KEYWORD,
  payload: {
    keyword,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_SEARCH_BOOKS,
});

export const hideSelectedBooks = () => ({
  type: HIDE_SELECTED_SEARCH_BOOKS,
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_SEARCH_BOOKS,
});

export const setSearchIsFetchingBooks = isFetchingBooks => ({
  type: SET_SEARCH_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

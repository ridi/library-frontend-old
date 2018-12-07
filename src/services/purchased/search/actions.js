export const LOAD_SEARCH_PAGE = 'LOAD_SEARCH_PAGE';

export const SET_SEARCH_ITEMS = 'SET_SEARCH_ITEMS';
export const SET_SEARCH_TOTAL_COUNT = 'SET_SEARCH_TOTAL_COUNT';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';

export const CHANGE_SEARCH_KEYWORD = 'CHANGE_SEARCH_KEYWORD';

export const SELECT_ALL_SEARCH_BOOKS = 'SELECT_ALL_SEARCH_BOOKS';
export const CLEAR_SELECTED_SEARCH_BOOKS = 'CLEAR_SELECTED_SEARCH_BOOKS';
export const TOGGLE_SELECT_SEARCH_BOOK = 'TOGGLE_SELECT_SEARCH_BOOK';
export const SET_SELECT_SEARCH_BOOKS = 'SET_SELECT_SEARCH_BOOKS';

export const HIDE_SELECTED_SEARCH_BOOKS = 'HIDE_SELECTED_SEARCH_BOOKS';
export const DOWNLOAD_SELECTED_SEARCH_BOOKS = 'DOWNLOAD_SELECTED_SEARCH_BOOKS';

export const loadSearchPage = () => ({
  type: LOAD_SEARCH_PAGE,
});

export const setSearchItems = items => ({
  type: SET_SEARCH_ITEMS,
  payload: {
    items,
  },
});

export const setSearchTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_SEARCH_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setSearchPage = page => ({
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

export const selectAllSearchBooks = () => ({
  type: SELECT_ALL_SEARCH_BOOKS,
});

export const clearSelectedSearchBooks = () => ({
  type: CLEAR_SELECTED_SEARCH_BOOKS,
});

export const toggleSelectSearchBook = bookId => ({
  type: TOGGLE_SELECT_SEARCH_BOOK,
  payload: {
    bookId,
  },
});

export const setSelectSearchBooks = bookIds => ({
  type: SET_SELECT_SEARCH_BOOKS,
  payload: {
    bookIds,
  },
});

export const hideSelectedSearchBooks = () => ({
  type: HIDE_SELECTED_SEARCH_BOOKS,
});

export const downloadSelectedSearchBooks = () => ({
  type: DOWNLOAD_SELECTED_SEARCH_BOOKS,
});

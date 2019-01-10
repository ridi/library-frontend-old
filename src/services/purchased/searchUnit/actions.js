export const LOAD_SEARCH_UNIT_ITEMS = 'LOAD_SEARCH_UNIT_ITEMS';

export const SET_SEARCH_UNIT_ITEMS = 'SET_SEARCH_UNIT_ITEMS';
export const SET_SEARCH_UNIT_TOTAL_COUNT = 'SET_SEARCH_UNIT_TOTAL_COUNT';
export const SET_SEARCH_UNIT_ID = 'SET_SEARCH_UNIT_ID';
export const SET_SEARCH_UNIT_PAGE = 'SET_SEARCH_UNIT_PAGE';
export const SET_SEARCH_UNIT_ORDER = 'SET_SEARCH_UNIT_ORDER';
export const SET_SEARCH_UNIT_KEYWORD = 'SET_SEARCH_UNIT_KEYWORD';

export const SELECT_ALL_SEARCH_UNIT_BOOKS = 'SELECT_ALL_SEARCH_UNIT_BOOKS ';
export const CLEAR_SELECTED_SEARCH_UNIT_BOOKS = 'CLEAR_SELECTED_SEARCH_UNIT_BOOKS';
export const TOGGLE_SELECT_SEARCH_UNIT_BOOK = 'TOGGLE_SELECT_SEARCH_UNIT_BOOK';
export const SET_SELECT_SEARCH_UNIT_BOOKS = 'SET_SELECT_SEARCH_UNIT_BOOKS';

export const HIDE_SELECTED_SEARCH_UNIT_BOOKS = 'HIDE_SELECTED_SEARCH_UNIT_BOOKS';
export const DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS = 'DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS';

export const loadItems = () => ({
  type: LOAD_SEARCH_UNIT_ITEMS,
});

export const setItems = items => ({
  type: SET_SEARCH_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = itemTotalCount => ({
  type: SET_SEARCH_UNIT_TOTAL_COUNT,
  payload: {
    itemTotalCount,
  },
});

export const setUnitId = unitId => ({
  type: SET_SEARCH_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setPage = page => ({
  type: SET_SEARCH_UNIT_PAGE,
  payload: {
    page,
  },
});

export const setOrder = order => ({
  type: SET_SEARCH_UNIT_ORDER,
  payload: {
    order,
  },
});

export const setKeyword = keyword => ({
  type: SET_SEARCH_UNIT_KEYWORD,
  payload: {
    keyword,
  },
});

export const selectBooks = bookIds => ({
  type: SET_SELECT_SEARCH_UNIT_BOOKS,
  payload: {
    bookIds,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_SEARCH_UNIT_BOOKS,
});

export const toggleSelectBook = bookId => ({
  type: TOGGLE_SELECT_SEARCH_UNIT_BOOK,
  payload: {
    bookId,
  },
});

export const clearSelectedBooks = () => ({
  type: CLEAR_SELECTED_SEARCH_UNIT_BOOKS,
});

export const hideSelectedBooks = () => ({
  type: HIDE_SELECTED_SEARCH_UNIT_BOOKS,
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS,
});

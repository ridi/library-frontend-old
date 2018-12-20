import { SET_SEARCH_UNIT } from '../searchUnit/actions';

export const LOAD_MAIN_UNIT_ITEMS = 'LOAD_MAIN_UNIT_ITEMS';

export const SET_MAIN_UNIT_ITEMS = 'SET_MAIN_UNIT_ITEMS';
export const SET_MAIN_UNIT = 'SET_MAIN_UNIT';
export const SET_MAIN_UNIT_TOTAL_COUNT = 'SET_MAIN_UNIT_TOTAL_COUNT';
export const SET_MAIN_UNIT_ID = 'SET_MAIN_UNIT_ID';
export const SET_MAIN_UNIT_PAGE = 'SET_MAIN_UNIT_PAGE';
export const SET_MAIN_UNIT_ORDER = 'SET_MAIN_UNIT_ORDER';

export const SELECT_MAIN_UNIT_BOOKS = 'SELECT_MAIN_UNIT_BOOKS';
export const SELECT_ALL_MAIN_UNIT_BOOKS = 'SELECT_ALL_MAIN_UNIT_BOOKS ';
export const TOGGLE_SELECT_MAIN_UNIT_BOOK = 'TOGGLE_SELECT_MAIN_UNIT_BOOK';
export const CLEAR_SELECTED_MAIN_UNIT_BOOKS = 'CLEAR_SELECTED_MAIN_UNIT_BOOKS';

export const HIDE_SELECTED_MAIN_UNIT_BOOKS = 'HIDE_SELECTED_MAIN_UNIT_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS = 'DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS';

export const loadItems = () => ({
  type: LOAD_MAIN_UNIT_ITEMS,
});

export const setItems = items => ({
  type: SET_MAIN_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setUnit = unit => ({
  type: SET_MAIN_UNIT,
  payload: {
    unit,
  },
});

export const setTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_MAIN_UNIT_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setUnitId = unitId => ({
  type: SET_MAIN_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setPage = page => ({
  type: SET_MAIN_UNIT_PAGE,
  payload: {
    page,
  },
});

export const setOrder = order => ({
  type: SET_MAIN_UNIT_ORDER,
  payload: {
    order,
  },
});

export const selectBooks = bookIds => ({
  type: SELECT_MAIN_UNIT_BOOKS,
  payload: {
    bookIds,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_MAIN_UNIT_BOOKS,
});

export const toggleSelectBook = bookId => ({
  type: TOGGLE_SELECT_MAIN_UNIT_BOOK,
  payload: {
    bookId,
  },
});

export const clearSelectedBooks = () => ({
  type: CLEAR_SELECTED_MAIN_UNIT_BOOKS,
});

export const hideSelectedBooks = () => ({
  type: HIDE_SELECTED_MAIN_UNIT_BOOKS,
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS,
});

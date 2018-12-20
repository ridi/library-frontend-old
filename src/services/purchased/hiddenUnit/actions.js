export const LOAD_HIDDEN_UNIT_ITEMS = 'LOAD_HIDDEN_UNIT_ITEMS';

export const SET_HIDDEN_UNIT_ITEMS = 'SET_HIDDEN_UNIT_ITEMS';
export const SET_HIDDEN_UNIT_TOTAL_COUNT = 'SET_HIDDEN_UNIT_TOTAL_COUNT';
export const SET_HIDDEN_UNIT_ID = 'SET_HIDDEN_UNIT_ID';
export const SET_HIDDEN_UNIT_PAGE = 'SET_HIDDEN_UNIT_PAGE';

export const SELECT_HIDDEN_UNIT_BOOKS = 'SELECT_HIDDEN_UNIT_BOOKS';
export const SELECT_ALL_HIDDEN_UNIT_BOOKS = 'SELECT_ALL_HIDDEN_UNIT_BOOKS ';
export const TOGGLE_SELECT_HIDDEN_UNIT_BOOK = 'TOGGLE_SELECT_HIDDEN_UNIT_BOOK';
export const CLEAR_SELECTED_HIDDEN_UNIT_BOOKS = 'CLEAR_SELECTED_HIDDEN_UNIT_BOOKS';

export const UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS = 'UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS';
export const DELETE_SELECTED_HIDDEN_UNIT_BOOKS = 'DELETE_SELECTED_HIDDEN_UNIT_BOOKS';

export const loadItems = () => ({
  type: LOAD_HIDDEN_UNIT_ITEMS,
});

export const setItems = items => ({
  type: SET_HIDDEN_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_HIDDEN_UNIT_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setUnitId = unitId => ({
  type: SET_HIDDEN_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setPage = page => ({
  type: SET_HIDDEN_UNIT_PAGE,
  payload: {
    page,
  },
});

export const selectBooks = bookIds => ({
  type: SELECT_HIDDEN_UNIT_BOOKS,
  payload: {
    bookIds,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_HIDDEN_UNIT_BOOKS,
});

export const toggleSelectBook = bookId => ({
  type: TOGGLE_SELECT_HIDDEN_UNIT_BOOK,
  payload: {
    bookId,
  },
});

export const clearSelectedBooks = () => ({
  type: CLEAR_SELECTED_HIDDEN_UNIT_BOOKS,
});

export const unhideSelectedBooks = () => ({
  type: UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS,
});

export const deleteSelectedBooks = () => ({
  type: DELETE_SELECTED_HIDDEN_UNIT_BOOKS,
});

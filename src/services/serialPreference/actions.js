export const LOAD_SERIAL_PREFERENCE_ITEMS = 'LOAD_SERIAL_PREFERENCE_ITEMS';

export const SET_SERIAL_PREFERENCE_ITEMS = 'SET_SERIAL_PREFERENCE_ITEMS';
export const SET_SERIAL_PREFERENCE_TOTAL_COUNT = 'SET_SERIAL_PREFERENCE_TOTAL_COUNT';
export const SET_SERIAL_PREFERENCE_PAGE = 'SET_SERIAL_PREFERENCE_PAGE';
export const SET_SERIAL_UNIT_ID_MAP = 'SET_SERIAL_UNIT_ID_MAP';

export const SELECT_SERIAL_PREFERENCE_BOOKS = 'SELECT_SERIAL_PREFERENCE_BOOKS';
export const SELECT_ALL_SERIAL_PREFERENCE_BOOKS = 'SELECT_ALL_SERIAL_PREFERENCE_BOOKS';
export const TOGGLE_SELECT_SERIAL_PREFERENCE_BOOK = 'TOGGLE_SELECT_SERIAL_PREFERENCE_BOOK';
export const CLEAR_SELECTED_SERIAL_PREFERENCE_BOOKS = 'CLEAR_SELECTED_SERIAL_PREFERENCE_BOOKS';
export const DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS = 'DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS';

export const SET_IS_FETCHING_BOOKS = 'SET_IS_FETCHING_BOOKS';

export const loadItems = () => ({
  type: LOAD_SERIAL_PREFERENCE_ITEMS,
});

export const setItems = items => ({
  type: SET_SERIAL_PREFERENCE_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = totalCount => ({
  type: SET_SERIAL_PREFERENCE_TOTAL_COUNT,
  payload: {
    totalCount,
  },
});

export const setPage = page => ({
  type: SET_SERIAL_PREFERENCE_PAGE,
  payload: {
    page,
  },
});

export const setSerialUnitIdMap = unitIdMap => ({
  type: SET_SERIAL_UNIT_ID_MAP,
  payload: {
    unitIdMap,
  },
});

export const selectBooks = bookIds => ({
  type: SELECT_SERIAL_PREFERENCE_BOOKS,
  payload: {
    bookIds,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_SERIAL_PREFERENCE_BOOKS,
});

export const toggleSelectBook = bookId => ({
  type: TOGGLE_SELECT_SERIAL_PREFERENCE_BOOK,
  payload: {
    bookId,
  },
});

export const clearSelectedBooks = () => ({
  type: CLEAR_SELECTED_SERIAL_PREFERENCE_BOOKS,
});

export const deleteSelectedBooks = () => ({
  type: DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS,
});

export const setIsFetchingBooks = isFetchingBooks => ({
  type: SET_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

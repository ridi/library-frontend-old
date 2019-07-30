export const LOAD_SERIAL_PREFERENCE_ITEMS = 'LOAD_SERIAL_PREFERENCE_ITEMS';

export const SET_SERIAL_PREFERENCE_ITEMS = 'SET_SERIAL_PREFERENCE_ITEMS';
export const SET_SERIAL_PREFERENCE_TOTAL_COUNT = 'SET_SERIAL_PREFERENCE_TOTAL_COUNT';
export const SET_SERIAL_UNIT_ID_MAP = 'SET_SERIAL_UNIT_ID_MAP';

export const SELECT_ALL_SERIAL_PREFERENCE_BOOKS = 'SELECT_ALL_SERIAL_PREFERENCE_BOOKS';
export const DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS = 'DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS';

export const SET_IS_FETCHING_BOOKS = 'SET_IS_FETCHING_BOOKS';

export const loadItems = page => ({
  type: LOAD_SERIAL_PREFERENCE_ITEMS,
  payload: {
    page,
  },
});

export const setItems = (items, page) => ({
  type: SET_SERIAL_PREFERENCE_ITEMS,
  payload: {
    items,
    page,
  },
});

export const setTotalCount = totalCount => ({
  type: SET_SERIAL_PREFERENCE_TOTAL_COUNT,
  payload: {
    totalCount,
  },
});

export const setSerialUnitIdMap = unitIdMap => ({
  type: SET_SERIAL_UNIT_ID_MAP,
  payload: {
    unitIdMap,
  },
});

export const selectAllBooks = page => ({
  type: SELECT_ALL_SERIAL_PREFERENCE_BOOKS,
  payload: {
    page,
  },
});

export const deleteSelectedBooks = page => ({
  type: DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS,
  payload: {
    page,
  },
});

export const setIsFetchingBooks = isFetchingBooks => ({
  type: SET_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

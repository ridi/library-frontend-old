export const LOAD_HIDDEN_UNIT_ITEMS = 'LOAD_HIDDEN_UNIT_ITEMS';

export const SET_HIDDEN_UNIT_ITEMS = 'SET_HIDDEN_UNIT_ITEMS';
export const SET_HIDDEN_UNIT_TOTAL_COUNT = 'SET_HIDDEN_UNIT_TOTAL_COUNT';
export const SET_HIDDEN_UNIT_ID = 'SET_HIDDEN_UNIT_ID';
export const SET_HIDDEN_UNIT_PAGE = 'SET_HIDDEN_UNIT_PAGE';

export const SELECT_ALL_HIDDEN_UNIT_BOOKS = 'SELECT_ALL_HIDDEN_UNIT_BOOKS ';
export const UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS = 'UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS';
export const DELETE_SELECTED_HIDDEN_UNIT_BOOKS = 'DELETE_SELECTED_HIDDEN_UNIT_BOOKS';

export const SET_IS_FETCHING_HIDDEN_BOOK = 'SET_IS_FETCHING_HIDDEN_BOOK';

export const SET_HIDDEN_UNIT_PRIMARY_ITEM = 'SET_HIDDEN_UNIT_PRIMARY_ITEM';

export const loadItems = () => ({
  type: LOAD_HIDDEN_UNIT_ITEMS,
});

export const setItems = items => ({
  type: SET_HIDDEN_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = itemTotalCount => ({
  type: SET_HIDDEN_UNIT_TOTAL_COUNT,
  payload: {
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

export const selectAllBooks = () => ({
  type: SELECT_ALL_HIDDEN_UNIT_BOOKS,
});

export const unhideSelectedBooks = () => ({
  type: UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS,
});

export const deleteSelectedBooks = () => ({
  type: DELETE_SELECTED_HIDDEN_UNIT_BOOKS,
});

export const setIsFetchingHiddenBook = isFetchingBook => ({
  type: SET_IS_FETCHING_HIDDEN_BOOK,
  payload: {
    isFetchingBook,
  },
});

export const setHiddenUnitPrimaryItem = primaryItem => ({
  type: SET_HIDDEN_UNIT_PRIMARY_ITEM,
  payload: {
    primaryItem,
  },
});

export const LOAD_HIDDEN_ITEMS = 'LOAD_HIDDEN_ITEMS';

export const SET_HIDDEN_ITEMS = 'SET_HIDDEN_ITEMS';
export const SET_HIDDEN_TOTAL_COUNT = 'SET_HIDDEN_TOTAL_COUNT';

export const UNHIDE_SELECTED_HIDDEN_BOOKS = 'UNHIDE_SELECTED_HIDDEN_BOOKS';
export const DELETE_SELECTED_HIDDEN_BOOKS = 'DELETE_SELECTED_HIDDEN_BOOKS';
export const SELECT_ALL_HIDDEN_BOOKS = 'SELECT_ALL_HIDDEN_BOOKS';

export const SET_HIDDEN_IS_FETCHING_BOOKS = 'SET_HIDDEN_IS_FETCHING_BOOKS';

export const loadItems = page => ({
  type: LOAD_HIDDEN_ITEMS,
  payload: {
    page,
  },
});

export const setItems = (items, page) => ({
  type: SET_HIDDEN_ITEMS,
  payload: {
    items,
    page,
  },
});

export const setTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_HIDDEN_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const selectAllBooks = page => ({
  type: SELECT_ALL_HIDDEN_BOOKS,
  payload: {
    page,
  },
});

export const unhideSelectedBooks = page => ({
  type: UNHIDE_SELECTED_HIDDEN_BOOKS,
  payload: {
    page,
  },
});

export const deleteSelectedBooks = page => ({
  type: DELETE_SELECTED_HIDDEN_BOOKS,
  payload: {
    page,
  },
});

export const setHiddenIsFetchingBooks = isFetchingBooks => ({
  type: SET_HIDDEN_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

export const LOAD_HIDDEN_ITEMS = 'LOAD_HIDDEN_ITEMS';

export const SET_HIDDEN_ITEMS = 'SET_HIDDEN_ITEMS';
export const SET_HIDDEN_TOTAL_COUNT = 'SET_HIDDEN_TOTAL_COUNT';
export const SET_HIDDEN_PAGE = 'SET_HIDDEN_PAGE';

export const UNHIDE_SELECTED_HIDDEN_BOOKS = 'UNHIDE_SELECTED_HIDDEN_BOOKS';
export const DELETE_SELECTED_HIDDEN_BOOKS = 'DELETE_SELECTED_HIDDEN_BOOKS';
export const SELECT_ALL_HIDDEN_BOOKS = 'SELECT_ALL_HIDDEN_BOOKS';

export const SET_HIDDEN_IS_FETCHING_BOOKS = 'SET_HIDDEN_IS_FETCHING_BOOKS';

export const loadItems = () => ({
  type: LOAD_HIDDEN_ITEMS,
});

export const setItems = items => ({
  type: SET_HIDDEN_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_HIDDEN_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setPage = page => ({
  type: SET_HIDDEN_PAGE,
  payload: {
    page,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_HIDDEN_BOOKS,
});

export const unhideSelectedBooks = () => ({
  type: UNHIDE_SELECTED_HIDDEN_BOOKS,
});

export const deleteSelectedBooks = () => ({
  type: DELETE_SELECTED_HIDDEN_BOOKS,
});

export const setHiddenIsFetchingBooks = isFetchingBooks => ({
  type: SET_HIDDEN_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

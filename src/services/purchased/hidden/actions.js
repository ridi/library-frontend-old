export const LOAD_HIDDEN_ITEMS = 'LOAD_HIDDEN_ITEMS';

export const SET_HIDDEN_ITEMS = 'SET_HIDDEN_ITEMS';
export const SET_HIDDEN_TOTAL_COUNT = 'SET_HIDDEN_TOTAL_COUNT';
export const SET_HIDDEN_PAGE = 'SET_HIDDEN_PAGE';

export const SHOW_SELECTED_HIDDEN_BOOKS = 'SHOW_SELECTED_HIDDEN_BOOKS';
export const DELETE_SELECTED_HIDDEN_BOOKS = 'DELETE_SELECTED_HIDDEN_BOOKS';

export const SELECT_ALL_HIDDEN_BOOKS = 'SELECT_ALL_HIDDEN_BOOKS';
export const CLEAR_SELECTED_HIDDEN_BOOKS = 'CLEAR_SELECTED_HIDDEN_BOOKS';
export const TOGGLE_SELECT_HIDDEN_BOOK = 'TOGGLE_SELECT_HIDDEN_BOOK';
export const SET_SELECT_HIDDEN_BOOKS = 'SET_SELECT_HIDDEN_BOOKS';

export const loadHiddenItems = () => ({
  type: LOAD_HIDDEN_ITEMS,
});

export const setHiddenItems = items => ({
  type: SET_HIDDEN_ITEMS,
  payload: {
    items,
  },
});

export const setHiddenTotalCount = itemTotalCount => ({
  type: SET_HIDDEN_TOTAL_COUNT,
  payload: {
    itemTotalCount,
  },
});

export const setHiddenPage = page => ({
  type: SET_HIDDEN_PAGE,
  payload: {
    page,
  },
});

export const selectAllHiddenBooks = () => ({
  type: SELECT_ALL_HIDDEN_BOOKS,
});

export const clearSelectedHiddenBooks = () => ({
  type: CLEAR_SELECTED_HIDDEN_BOOKS,
});

export const toggleSelectHiddenBook = bookId => ({
  type: TOGGLE_SELECT_HIDDEN_BOOK,
  payload: {
    bookId,
  },
});

export const setSelectHiddenBooks = bookIds => ({
  type: SET_SELECT_HIDDEN_BOOKS,
  payload: {
    bookIds,
  },
});

export const showSelectedHiddenBooks = () => ({
  type: SHOW_SELECTED_HIDDEN_BOOKS,
});

export const deleteSelectedHiddenBooks = () => ({
  type: DELETE_SELECTED_HIDDEN_BOOKS,
});

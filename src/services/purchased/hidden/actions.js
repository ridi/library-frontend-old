export const LOAD_PURCHASED_HIDDEN_ITEMS = 'LOAD_PURCHASED_HIDDEN_ITEMS';

export const SET_PURCHASED_HIDDEN_ITEMS = 'SET_PURCHASED_HIDDEN_ITEMS';
export const SET_PURCHASED_HIDDEN_TOTAL_COUNT = 'SET_PURCHASED_HIDDEN_TOTAL_COUNT';
export const SET_PURCHASED_HIDDEN_PAGE = 'SET_PURCHASED_HIDDEN_PAGE';

export const SHOW_SELECTED_BOOKS = 'SHOW_SELECTED_BOOKS';
export const DELETE_SELECTED_BOOKS = 'DELETE_SELECTED_BOOKS';

export const SELECT_ALL_HIDDEN_BOOKS = 'SELECT_ALL_HIDDEN_BOOKS';
export const CLEAR_SELECTED_HIDDEN_BOOKS = 'CLEAR_SELECTED_HIDDEN_BOOKS';
export const TOGGLE_SELECT_HIDDEN_BOOK = 'TOGGLE_SELECT_HIDDEN_BOOK';

export const loadPurchasedHiddenItems = () => ({
  type: LOAD_PURCHASED_HIDDEN_ITEMS,
});

export const setPurchasedHiddenItems = items => ({
  type: SET_PURCHASED_HIDDEN_ITEMS,
  payload: {
    items,
  },
});

export const setPurchasedHiddenTotalCount = itemTotalCount => ({
  type: SET_PURCHASED_HIDDEN_TOTAL_COUNT,
  payload: {
    itemTotalCount,
  },
});

export const setPurchasedHiddenPage = page => ({
  type: SET_PURCHASED_HIDDEN_PAGE,
  payload: {
    page,
  },
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

export const showSelectedBooks = () => ({
  type: SHOW_SELECTED_BOOKS,
});

export const deleteSelectedBooks = () => ({
  type: DELETE_SELECTED_BOOKS,
});

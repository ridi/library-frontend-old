export const LOAD_MAIN_ITEMS = 'LOAD_MAIN_ITEMS';
export const START_LOAD_MAIN_ITEMS = 'START_LOAD_MAIN_ITEMS';

export const UPDATE_MAIN_ITEMS = 'UPDATE_MAIN_ITEMS';
export const UPDATE_MAIN_OPTIONS = 'UPDATE_MAIN_OPTIONS';

export const SELECT_MAIN_BOOKS = 'SELECT_MAIN_BOOKS';
export const SELECT_ALL_MAIN_BOOKS = 'SELECT_ALL_MAIN_BOOKS';
export const TOGGLE_SELECT_MAIN_BOOK = 'TOGGLE_SELECT_MAIN_BOOK';
export const CLEAR_SELECTED_MAIN_BOOKS = 'CLEAR_SELECTED_MAIN_BOOKS';

export const HIDE_SELECTED_MAIN_BOOKS = 'HIDE_SELECTED_MAIN_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_BOOKS = 'DOWNLOAD_SELECTED_MAIN_BOOKS';

export const SET_IS_FETCHING_BOOKS = 'SET_IS_FETCHING_BOOKS';

export const loadItems = () => ({
  type: LOAD_MAIN_ITEMS,
});

export const startLoadItems = options => ({
  type: START_LOAD_MAIN_ITEMS,
  payload: options,
});

export const updateItems = ({ items, unitTotalCount, itemTotalCount, filterOptions }) => ({
  type: UPDATE_MAIN_ITEMS,
  payload: {
    items,
    unitTotalCount,
    itemTotalCount,
    filterOptions,
  },
});

export const selectBooks = bookIds => ({
  type: SELECT_MAIN_BOOKS,
  payload: {
    bookIds,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_MAIN_BOOKS,
});

export const toggleSelectBook = bookId => ({
  type: TOGGLE_SELECT_MAIN_BOOK,
  payload: {
    bookId,
  },
});

export const clearSelectedBooks = () => ({
  type: CLEAR_SELECTED_MAIN_BOOKS,
});

export const hideSelectedBooks = () => ({
  type: HIDE_SELECTED_MAIN_BOOKS,
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_MAIN_BOOKS,
});

export const setIsFetchingBooks = isFetchingBooks => ({
  type: SET_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

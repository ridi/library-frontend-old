export const LOAD_MAIN_ITEMS = 'LOAD_MAIN_ITEMS';

export const UPDATE_MAIN_ITEMS = 'UPDATE_MAIN_ITEMS';
export const UPDATE_MAIN_OPTIONS = 'UPDATE_MAIN_OPTIONS';

export const SELECT_ALL_MAIN_BOOKS = 'SELECT_ALL_MAIN_BOOKS';
export const HIDE_SELECTED_MAIN_BOOKS = 'HIDE_SELECTED_MAIN_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_BOOKS = 'DOWNLOAD_SELECTED_MAIN_BOOKS';
export const ADD_MAIN_SELECTED_TO_SHELF = 'ADD_MAIN_SELECTED_TO_SHELF';

export const SET_IS_FETCHING_BOOKS = 'SET_IS_FETCHING_BOOKS';

export const loadItems = (payload, isServer = false) => ({
  type: LOAD_MAIN_ITEMS,
  payload: {
    ...payload,
    isServer,
  },
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

export const selectAllBooks = () => ({
  type: SELECT_ALL_MAIN_BOOKS,
});

export const hideSelectedBooks = () => ({
  type: HIDE_SELECTED_MAIN_BOOKS,
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_MAIN_BOOKS,
});

export const addSelectedToShelf = uuid => ({
  type: ADD_MAIN_SELECTED_TO_SHELF,
  payload: {
    uuid,
  },
});

export const setIsFetchingBooks = isFetchingBooks => ({
  type: SET_IS_FETCHING_BOOKS,
  payload: {
    isFetchingBooks,
  },
});

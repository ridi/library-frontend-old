export const LOAD_MAIN_ITEMS = 'LOAD_MAIN_ITEMS';

export const SET_MAIN_ITEMS = 'SET_MAIN_ITEMS';
export const SET_MAIN_TOTAL_COUNT = 'SET_MAIN_TOTAL_COUNT';
export const SET_MAIN_PAGE = 'SET_MAIN_PAGE';
export const SET_MAIN_ORDER = 'SET_MAIN_ORDER';
export const SET_MAIN_FILTER = 'SET_MAIN_FILTER';
export const SET_MAIN_FILTER_OPTIONS = 'SET_MAIN_FILTER_OPTIONS';

export const SELECT_MAIN_BOOKS = 'SELECT_MAIN_BOOKS';
export const SELECT_ALL_MAIN_BOOKS = 'SELECT_ALL_MAIN_BOOKS';
export const TOGGLE_SELECT_MAIN_BOOK = 'TOGGLE_SELECT_MAIN_BOOK';
export const CLEAR_SELECTED_MAIN_BOOKS = 'CLEAR_SELECTED_MAIN_BOOKS';

export const HIDE_SELECTED_MAIN_BOOKS = 'HIDE_SELECTED_MAIN_BOOKS';
export const DOWNLOAD_SELECTED_MAIN_BOOKS = 'DOWNLOAD_SELECTED_MAIN_BOOKS';

export const SET_IS_LOADING = 'SET_IS_LOADING';

export const loadItems = () => ({
  type: LOAD_MAIN_ITEMS,
});

export const setItems = items => ({
  type: SET_MAIN_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_MAIN_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setPage = page => ({
  type: SET_MAIN_PAGE,
  payload: {
    page,
  },
});

export const setOrder = order => ({
  type: SET_MAIN_ORDER,
  payload: {
    order,
  },
});

export const setFilter = filter => ({
  type: SET_MAIN_FILTER,
  payload: {
    filter,
  },
});

export const setFilterOptions = options => ({
  type: SET_MAIN_FILTER_OPTIONS,
  payload: {
    options,
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

export const setIsLoading = isLoading => ({
  type: SET_IS_LOADING,
  payload: {
    isLoading,
  },
});

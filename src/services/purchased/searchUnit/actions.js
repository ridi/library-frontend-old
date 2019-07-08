export const LOAD_SEARCH_UNIT_ITEMS = 'LOAD_SEARCH_UNIT_ITEMS';

export const SET_SEARCH_UNIT_ITEMS = 'SET_SEARCH_UNIT_ITEMS';
export const SET_SEARCH_UNIT_TOTAL_COUNT = 'SET_SEARCH_UNIT_TOTAL_COUNT';
export const SET_SEARCH_UNIT_ID = 'SET_SEARCH_UNIT_ID';
export const SET_SEARCH_UNIT_PAGE = 'SET_SEARCH_UNIT_PAGE';
export const SET_SEARCH_UNIT_ORDER = 'SET_SEARCH_UNIT_ORDER';

export const SELECT_ALL_SEARCH_UNIT_BOOKS = 'SELECT_ALL_SEARCH_UNIT_BOOKS ';
export const HIDE_SELECTED_SEARCH_UNIT_BOOKS = 'HIDE_SELECTED_SEARCH_UNIT_BOOKS';
export const DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS = 'DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS';

export const SET_IS_FETCHING_SEARCH_BOOK = 'SET_IS_FETCHING_SEARCH_BOOK';

export const SET_SEARCH_UNIT_PRIMARY_ITEM = 'SET_SEARCH_UNIT_PRIMARY_ITEM';
export const SET_SEARCH_UNIT_PURCHASED_TOTAL_COUNT = 'SET_SEARCH_UNIT_PURCHASED_TOTAL_COUNT';

export const loadItems = () => ({
  type: LOAD_SEARCH_UNIT_ITEMS,
});

export const setItems = items => ({
  type: SET_SEARCH_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setTotalCount = itemTotalCount => ({
  type: SET_SEARCH_UNIT_TOTAL_COUNT,
  payload: {
    itemTotalCount,
  },
});

export const setUnitId = unitId => ({
  type: SET_SEARCH_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setPage = page => ({
  type: SET_SEARCH_UNIT_PAGE,
  payload: {
    page,
  },
});

export const setOrder = order => ({
  type: SET_SEARCH_UNIT_ORDER,
  payload: {
    order,
  },
});

export const selectAllBooks = () => ({
  type: SELECT_ALL_SEARCH_UNIT_BOOKS,
});

export const hideSelectedBooks = () => ({
  type: HIDE_SELECTED_SEARCH_UNIT_BOOKS,
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS,
});

export const setIsFetchingSearchBook = isFetchingBook => ({
  type: SET_IS_FETCHING_SEARCH_BOOK,
  payload: {
    isFetchingBook,
  },
});

export const setPrimaryItem = primaryItem => ({
  type: SET_SEARCH_UNIT_PRIMARY_ITEM,
  payload: {
    primaryItem,
  },
});

export const setPurchasedTotalCount = purchasedTotalCount => ({
  type: SET_SEARCH_UNIT_PURCHASED_TOTAL_COUNT,
  payload: {
    purchasedTotalCount,
  },
});

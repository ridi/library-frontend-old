export const LOAD_UNIT_ITEMS = 'LOAD_UNIT_ITEMS';

export const SET_UNIT_ITEMS = 'SET_UNIT_ITEMS';
export const SET_UNIT_TOTAL_COUNT = 'SET_UNIT_TOTAL_COUNT';

export const SELECT_ALL_UNIT_BOOKS = 'SELECT_ALL_UNIT_BOOKS ';
export const HIDE_SELECTED_UNIT_BOOKS = 'HIDE_SELECTED_UNIT_BOOKS';
export const UNHIDE_SELECTED_UNIT_BOOKS = 'UNHIDE_SELECTED_UNIT_BOOKS';
export const DELETE_SELECTED_UNIT_BOOKS = 'DELETE_SELECTED_UNIT_BOOKS';
export const DOWNLOAD_SELECTED_UNIT_BOOKS = 'DOWNLOAD_SELECTED_UNIT_BOOKS';

export const SET_IS_FETCHING_BOOK = 'SET_IS_FETCHING_BOOK';

export const SET_UNIT_PRIMARY_ITEM = 'SET_UNIT_PRIMARY_ITEM';
export const SET_UNIT_PURCHASED_TOTAL_COUNT = 'SET_UNIT_PURCHASED_TOTAL_COUNT';

export const loadItems = ({ kind, unitId, orderBy, orderDirection, page }) => ({
  type: LOAD_UNIT_ITEMS,
  payload: {
    kind,
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

export const setItems = (items, { unitId, orderBy, orderDirection, page }) => ({
  type: SET_UNIT_ITEMS,
  payload: {
    items,
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

export const setTotalCount = (itemTotalCount, { unitId, orderBy, orderDirection, page }) => ({
  type: SET_UNIT_TOTAL_COUNT,
  payload: {
    itemTotalCount,
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

export const selectAllBooks = ({ unitId, orderBy, orderDirection, page }) => ({
  type: SELECT_ALL_UNIT_BOOKS,
  payload: {
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

export const hideSelectedBooks = ({ kind, unitId, orderBy, orderDirection, page }) => ({
  type: HIDE_SELECTED_UNIT_BOOKS,
  payload: {
    kind,
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

export const unhideSelectedBooks = ({ kind, unitId, orderBy, orderDirection, page }) => ({
  type: UNHIDE_SELECTED_UNIT_BOOKS,
  payload: {
    kind,
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

export const deleteSelectedBooks = ({ kind, unitId, orderBy, orderDirection, page }) => ({
  type: DELETE_SELECTED_UNIT_BOOKS,
  payload: {
    kind,
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_UNIT_BOOKS,
});

export const setIsFetchingBook = isFetchingBook => ({
  type: SET_IS_FETCHING_BOOK,
  payload: {
    isFetchingBook,
  },
});

export const setPrimaryItem = (kind, unitId, primaryItem) => ({
  type: SET_UNIT_PRIMARY_ITEM,
  payload: {
    kind,
    unitId,
    primaryItem,
  },
});

export const setPurchasedTotalCount = (purchasedTotalCount, { unitId, orderBy, orderDirection, page }) => ({
  type: SET_UNIT_PURCHASED_TOTAL_COUNT,
  payload: {
    purchasedTotalCount,
    unitId,
    orderBy,
    orderDirection,
    page,
  },
});

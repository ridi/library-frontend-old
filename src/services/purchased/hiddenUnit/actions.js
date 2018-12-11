export const LOAD_HIDDEN_UNIT_ITEMS = 'LOAD_HIDDEN_UNIT_ITEMS';

export const SET_HIDDEN_UNIT_ITEMS = 'SET_HIDDEN_UNIT_ITEMS';
export const SET_HIDDEN_UNIT_TOTAL_COUNT = 'SET_HIDDEN_UNIT_TOTAL_COUNT';
export const SET_HIDDEN_UNIT_ID = 'SET_HIDDEN_UNIT_ID';
export const SET_HIDDEN_UNIT_PAGE = 'SET_HIDDEN_UNIT_PAGE';

export const SELECT_ALL_HIDDEN_UNIT_BOOKS = 'SELECT_ALL_HIDDEN_UNIT_BOOKS ';
export const CLEAR_SELECTED_HIDDEN_UNIT_BOOKS = 'CLEAR_SELECTED_HIDDEN_UNIT_BOOKS';
export const TOGGLE_SELECT_HIDDEN_UNIT_BOOK = 'TOGGLE_SELECT_HIDDEN_UNIT_BOOK';
export const SET_SELECT_HIDDEN_UNIT_BOOKS = 'SET_SELECT_HIDDEN_UNIT_BOOKS';

export const UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS = 'UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS';
export const DELETE_SELECTED_HIDDEN_UNIT_BOOKS = 'DELETE_SELECTED_HIDDEN_UNIT_BOOKS';

export const loadHiddenUnitItems = () => ({
  type: LOAD_HIDDEN_UNIT_ITEMS,
});

export const setHiddenUnitItems = items => ({
  type: SET_HIDDEN_UNIT_ITEMS,
  payload: {
    items,
  },
});

export const setHiddenUnitTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_HIDDEN_UNIT_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setHiddenUnitId = unitId => ({
  type: SET_HIDDEN_UNIT_ID,
  payload: {
    unitId,
  },
});

export const setHiddenUnitPage = page => ({
  type: SET_HIDDEN_UNIT_PAGE,
  payload: {
    page,
  },
});

export const selectAllHiddenUnitBooks = () => ({
  type: SELECT_ALL_HIDDEN_UNIT_BOOKS,
});

export const clearSelectedHiddenUnitBooks = () => ({
  type: CLEAR_SELECTED_HIDDEN_UNIT_BOOKS,
});

export const toggleSelectHiddenUnitBook = bookId => ({
  type: TOGGLE_SELECT_HIDDEN_UNIT_BOOK,
  payload: {
    bookId,
  },
});

export const setSelectHiddenUnitBooks = bookIds => ({
  type: SET_SELECT_HIDDEN_UNIT_BOOKS,
  payload: {
    bookIds,
  },
});

export const unHideSelectedHiddenUnitBooks = () => ({
  type: UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS,
});

export const deleteSelectedHiddenUnitBooks = () => ({
  type: DELETE_SELECTED_HIDDEN_UNIT_BOOKS,
});

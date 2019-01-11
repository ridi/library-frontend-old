export const SET_BOOK_DATA = 'SET_BOOK_DATA';
export const SET_UNIT_DATA = 'SET_UNIT_DATA';

export const SET_BOOK_DATA_FROM_STORAGE = 'SET_BOOK_DATA_FROM_STORAGE';
export const LOAD_BOOK_DATA_FROM_STORAGE = 'LOAD_BOOK_DATA_FROM_STORAGE';

export const setBookData = books => ({
  type: SET_BOOK_DATA,
  payload: {
    books,
  },
});

export const setUnitData = units => ({
  type: SET_UNIT_DATA,
  payload: {
    units,
  },
});

export const setBookDataFromStorage = (books, units) => ({
  type: SET_BOOK_DATA_FROM_STORAGE,
  payload: {
    books,
    units,
  },
});

export const loadBookDataFromStorage = () => ({
  type: LOAD_BOOK_DATA_FROM_STORAGE,
});


export const SET_BOOK_DATA = 'SET_BOOK_DATA';

export const LOAD_BOOK_DATA = 'LOAD_BOOK_DATA';
export const LOAD_BOOK_DATA_FROM_STORAGE = 'LOAD_BOOK_DATA_FROM_STORAGE';


export const setBookData = books => ({
  type: SET_BOOK_DATA,
  payload: {
    books,
  }
});

export const loadBookData = bookIds => ({
  type: LOAD_BOOK_DATA,
  payload: {
    bookIds,
  }
});

export const loadBookDataFromStorage = () => ({
  type: LOAD_BOOK_DATA_FROM_STORAGE,
});

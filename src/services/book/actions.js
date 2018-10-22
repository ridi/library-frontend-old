
export const SAVE_BOOK_DATA = 'SAVE_BOOK_DATA';
export const PERSIST_BOOK_DATA = 'PERSIST_BOOK_DATA';

export const saveBookData = books => ({
  type: SAVE_BOOK_DATA,
  payload: {
    books,
  }
});

export const persistBookData = () => ({
  type: PERSIST_BOOK_DATA,
});

export const SELECT_BOOKS = 'SELECT_BOOKS';
export const TOGGLE_BOOK = 'TOGGLE_BOOK';
export const CLEAR_SELECTED_BOOKS = 'CLEAR_SELECTED_BOOKS';

export const selectBooks = bookIds => ({
  type: SELECT_BOOKS,
  payload: bookIds,
});

export const toggleBook = bookId => ({
  type: TOGGLE_BOOK,
  payload: bookId,
});

export const clearSelectedBooks = () => ({
  type: CLEAR_SELECTED_BOOKS,
});

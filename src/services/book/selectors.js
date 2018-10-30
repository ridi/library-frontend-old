import { createSelector } from 'reselect';

const getBookState = state => state.books;

export const getBooks = (state, bookIds) =>
  createSelector(getBookState, bookState =>
    bookIds.reduce((previous, bookId) => {
      previous[bookId] = bookState.books.get(bookId);
      return previous;
    }, {}),
  )(state);

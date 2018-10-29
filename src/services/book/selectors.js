import { createSelector } from 'reselect';

const getBookState = state => state.books;

export const getBooks = (bookState, bookIds) =>
  createSelector(getBookState, state =>
    bookIds.reduce((previous, bookId) => {
      previous[bookId] = state.books.get(bookId);
      return previous;
    }, {}),
  )(bookState);

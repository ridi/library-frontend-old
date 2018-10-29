import { createSelector } from 'reselect';

export const getBooks = (bookState, bookIds) =>
  createSelector(state =>
    bookIds.reduce((previous, bookId) => {
      previous[bookId] = state.books.get(bookId);
      return previous;
    }, {}),
  )(bookState);

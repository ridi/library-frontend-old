import { createSelector } from 'reselect';

const getBookState = state => state.books;

export const getBooks = (state, bookIds) =>
  createSelector(
    getBookState,
    bookState =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = bookState.books.get(bookId);
        return previous;
      }, {}),
  )(state);

export const getBookDescriptions = (state, bookIds) =>
  createSelector(
    getBookState,
    bookState =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = bookState.bookDescriptions.get(bookId);
        return previous;
      }, {}),
  )(state);

export const getBookStarRatings = (state, bookIds) =>
  createSelector(
    getBookState,
    bookState =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = bookState.bookStarRatings.get(bookId);
        return previous;
      }, {}),
  )(state);

export const getUnit = (state, unitId) =>
  createSelector(
    getBookState,
    bookState => bookState.units.get(unitId),
  )(state);

export const getBook = (state, bookId) =>
  createSelector(
    getBookState,
    bookState => bookState.books.get(bookId),
  )(state);

export const getBookDescription = (state, bookId) =>
  createSelector(
    getBookState,
    bookState => bookState.bookDescriptions.get(bookId),
  )(state);

export const getBookStarRating = (state, bookId) =>
  createSelector(
    getBookState,
    bookState => bookState.bookStarRatings.get(bookId),
  )(state);

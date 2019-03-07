import { createSelector } from 'reselect';
import { EmptyUnit } from '../../utils/dataObject';
import { makeUnitOrderKey } from './actions';

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
    bookState => bookState.units.get(unitId) || EmptyUnit,
  )(state);

export const getUnitOrders = (state, unitId, orderType, orderBy, page) =>
  createSelector(
    getBookState,
    bookState => bookState.unitOrders.get(makeUnitOrderKey(unitId, orderType, orderBy, page)),
  )(state);

export const getBookDescription = (state, bookId) =>
  createSelector(
    getBookState,
    bookState => {
      const book = bookState.books.get(bookId);
      return book && book.series ? bookState.bookDescriptions.get(book.series.id) : bookState.bookDescriptions.get(bookId);
    },
  )(state);

export const getBookStarRating = (state, bookId) =>
  createSelector(
    getBookState,
    bookState => bookState.bookStarRatings.get(bookId),
  )(state);

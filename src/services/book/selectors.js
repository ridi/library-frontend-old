import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { EmptyUnit } from '../../utils/dataObject';
import { makeUnitOrderKey } from './actions';

const getBookState = state => state.books;

export const getBook = createCachedSelector(state => state.books.books, (state, bookId) => bookId, (books, bookId) => books[bookId])(
  (state, bookId) => bookId,
);

export const getBooks = createCachedSelector(
  state => state.books.books,
  (state, bookIds) => bookIds,
  (books, bookIds) =>
    bookIds.reduce((obj, bookId) => {
      obj[bookId] = books[bookId];
      return obj;
    }, {}),
)((state, bookIds) => [...bookIds].sort().join(','));

export const getBookDescriptions = (state, bookIds) =>
  createSelector(
    getBookState,
    bookState =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = bookState.bookDescriptions[bookId];
        return previous;
      }, {}),
  )(state);

export const getBookStarRatings = (state, bookIds) =>
  createSelector(
    getBookState,
    bookState =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = bookState.bookStarRatings[bookId];
        return previous;
      }, {}),
  )(state);

export const getUnit = (state, unitId) =>
  createSelector(
    getBookState,
    bookState => bookState.units[unitId] || EmptyUnit,
  )(state);

export const getUnits = createCachedSelector(
  state => state.books.units,
  (state, unitIds) => unitIds,
  (units, unitIds) =>
    unitIds.reduce((obj, unitId) => {
      obj[unitId] = units[unitId];
      return obj;
    }, {}),
)((state, unitIds) => [...unitIds].sort().join(','));

export const getUnitOrders = (state, unitId, orderType, orderBy, page) =>
  createSelector(
    getBookState,
    bookState => bookState.unitOrders[makeUnitOrderKey(unitId, orderType, orderBy, page)],
  )(state);

export const getBookDescription = (state, bookId) =>
  createSelector(
    getBookState,
    bookState => {
      const book = bookState.books[bookId];
      const id = book?.series?.id || bookId;
      return bookState.bookDescriptions[id];
    },
  )(state);

export const getBookStarRating = (state, bookId) =>
  createSelector(
    getBookState,
    bookState => bookState.bookStarRatings[bookId],
  )(state);

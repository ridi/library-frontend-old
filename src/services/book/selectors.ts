import createCachedSelector from 're-reselect';

import { EmptyUnit } from '../../utils/dataObject';
import { makeUnitOrderKey } from './actions';

export const getBook = (state, bookId) => state.books.books[bookId];
export const getUnit = (state, unitId) => state.books.units[unitId] || EmptyUnit;
export const getBookStarRating = (state, bookId) => state.books.bookStarRatings[bookId];
export const getBookDescription = (state, bookId) => {
  const seriesBookId = state.books.books[bookId] && state.books.books[bookId].series ? state.books.books[bookId].series.id : bookId;
  return state.books.bookDescriptions[seriesBookId];
};
export const getUnitOrders = (state, unitId, orderBy, orderDirection, page) =>
  state.books.unitOrders[makeUnitOrderKey(unitId, orderBy, orderDirection, page)];

export const getBooks = createCachedSelector(
  (state: any) => state.books.books,
  (state, bookIds) => bookIds,
  (books, bookIds) => Object.fromEntries(bookIds.map(bookId => [bookId, books[bookId]])),
)((state, bookIds) => [...bookIds].sort().join(','));

export const getDeletedBookIds = createCachedSelector(
  (state: any) => state.books.books,
  (state, bookIds) => bookIds,
  (books, bookIds) => bookIds.filter(bookId => books[bookId].isDeleted),
)((state, bookIds) => [...bookIds].sort().join(','));

export const getBookDescriptions = createCachedSelector(
  (state: any) => state.books.bookDescriptions,
  (state, bookIds) => bookIds,
  (bookDescriptions, bookIds) => Object.fromEntries(bookIds.map(bookId => [bookId, bookDescriptions[bookIds]])),
)((state, bookIds) => [...bookIds].sort().join(','));

export const getBookStarRatings = createCachedSelector(
  (state: any) => state.books.bookStarRatings,
  (state, bookIds) => bookIds,
  (bookStarRatings, bookIds) => Object.fromEntries(bookIds.map(bookId => [bookId, bookStarRatings[bookIds]])),
)((state, bookIds) => [...bookIds].sort().join(','));

export const getUnits = createCachedSelector(
  (state: any) => state.books.units,
  (state, unitIds) => unitIds,
  (units, unitIds) => Object.fromEntries(unitIds.map(unitId => [unitId, units[unitId]])),
)((state, unitIds) => [...unitIds].sort().join(','));

export const getOpenInfo = createCachedSelector(
  (state: any) => state.books.openInfo,
  (state, bookIds) => bookIds,
  (openInfo, bookIds) => Object.fromEntries(bookIds.map(bookId => [bookId, openInfo[bookId]])),
)((state, bookIds) => [...bookIds].sort().join(','));

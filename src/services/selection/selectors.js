import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

export const getSelectedBooks = state => state.selection;

export const getIsBookSelected = createCachedSelector(
  getSelectedBooks,
  (state, bookId) => bookId,
  (selection, bookId) => Boolean(selection[bookId]),
)((state, bookId) => bookId);

export const getTotalSelectedCount = createSelector(
  getSelectedBooks,
  books => Object.values(books).filter(x => x).length,
);

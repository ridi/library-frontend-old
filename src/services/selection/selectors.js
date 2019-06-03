import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

export const getSelectedItems = state => state.selection;

export const getSelectedItemsId = createSelector(
  getSelectedItems,
  selection =>
    Object.entries(selection)
      .filter(([, value]) => value)
      .map(([itemId]) => itemId),
);

export const getIsBookSelected = createCachedSelector(
  getSelectedItems,
  (state, bookId) => bookId,
  (selection, bookId) => Boolean(selection[bookId]),
)((state, bookId) => bookId);

export const getTotalSelectedCount = createSelector(
  getSelectedItems,
  items => Object.values(items).filter(x => x).length,
);

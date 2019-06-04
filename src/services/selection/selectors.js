import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

export const getSelectedItems = state => state.selection;

export const getSelectedItemIds = createSelector(
  getSelectedItems,
  selection =>
    Object.entries(selection)
      .filter(([, value]) => value)
      .map(([itemId]) => itemId),
);

export const getIsItemSelected = createCachedSelector(
  getSelectedItems,
  (state, itemId) => itemId,
  (selection, itemId) => Boolean(selection[itemId]),
)((state, itemId) => itemId);

export const getTotalSelectedCount = createSelector(
  getSelectedItems,
  items => Object.values(items).filter(x => x).length,
);

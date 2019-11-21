import { createSelector } from 'reselect';

export const getSelectedItems = state => state.selection.ids;

export const getSelectedItemIds = createSelector(getSelectedItems, selection =>
  Object.entries(selection)
    .filter(([, value]) => value)
    .map(([itemId]) => itemId),
);

export const getIsItemSelected = (state, itemId) => Boolean(getSelectedItems(state)[itemId]);

export const getTotalSelectedCount = createSelector(getSelectedItems, items => Object.values(items).filter(x => x).length);

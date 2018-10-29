import { createSelector } from 'reselect';

export const getItemsByPage = createSelector(purchaseState => {
  const { page } = purchaseState;
  const itemIdsByPage = purchaseState.itemIds[page];
  return itemIdsByPage.map(itemId => purchaseState.items[itemId]);
});

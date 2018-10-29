import { createSelector } from 'reselect';

const getPurchaseState = state => state.purchase;

export const getItemsByPage = createSelector(
  getPurchaseState,
  purchaseState => {
    const { page } = purchaseState;
    const itemIdsByPage = purchaseState.itemIds[page];
    return itemIdsByPage.map(itemId => purchaseState.items[itemId]);
  },
);

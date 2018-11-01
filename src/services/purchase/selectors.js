import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT } from './constants';
import { calcPage } from '../../utils/pagination';

const getPurchaseState = state => state.purchase;

export const getItemsByPage = createSelector(
  getPurchaseState,
  purchaseState => {
    const { page } = purchaseState;
    const itemIdsByPage = purchaseState.itemIds[page] || [];
    return itemIdsByPage.map(itemId => purchaseState.items[itemId]);
  },
);

export const getPageInfo = createSelector(getPurchaseState, purchaseState => {
  const { page, unitTotalCount } = purchaseState;
  return {
    currentPage: page,
    totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT),
  };
});

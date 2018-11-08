import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT } from '../../purchase/constants';
import { calcPage } from '../../../utils/pagination';

const getPurchaseHiddenState = state => state.purchaseHidden;

export const getItemsByPage = createSelector(getPurchaseHiddenState, purchaseHiddenState => {
  const { page } = purchaseHiddenState;
  return purchaseHiddenState.items[page] || [];
});

export const getPageInfo = createSelector(getPurchaseHiddenState, purchaseHiddenState => {
  const { page, itemTotalCount } = purchaseHiddenState;
  return {
    currentPage: page,
    totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT),
  };
});

export const getPage = createSelector(getPurchaseHiddenState, purchaseHiddenState => purchaseHiddenState.page);

export const getItemTotalCount = createSelector(
  getPurchaseHiddenState,
  purchaseHiddenState => purchaseHiddenState.itemTotalCount,
);

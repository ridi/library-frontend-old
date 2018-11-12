import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getPurchasedHiddenState = state => state.purchasedHidden;

export const getItemsByPage = createSelector(getPurchasedHiddenState, purchasedHiddenState => {
  const { page } = purchasedHiddenState;
  return purchasedHiddenState.items[page] || [];
});

export const getPageInfo = createSelector(getPurchasedHiddenState, purchasedHiddenState => {
  const { page, itemTotalCount } = purchasedHiddenState;
  return {
    currentPage: page,
    totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
  };
});

export const getPage = createSelector(getPurchasedHiddenState, purchasedHiddenState => purchasedHiddenState.page);

export const getItemTotalCount = createSelector(getPurchasedHiddenState, purchasedHiddenState => purchasedHiddenState.itemTotalCount);

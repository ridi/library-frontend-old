import { createSelector } from 'reselect';

import { mainOrderOptions } from '../../constants/orderOptions';
import { LIBRARY_ITEMS_LIMIT } from './constants';
import { calcPage } from '../../utils/pagination';

const getPurchaseState = state => state.purchase;

export const getItemsByPage = createSelector(
  getPurchaseState,
  purchaseState => {
    const { page } = purchaseState;
    return purchaseState.items[page] || [];
  },
);

export const getPageInfo = createSelector(getPurchaseState, purchaseState => {
  const { page, unitTotalCount } = purchaseState;
  return {
    currentPage: page,
    totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT),
  };
});

export const getOrder = createSelector(
  getPurchaseState,
  purchaseState => purchaseState.order,
);

export const getFilter = createSelector(
  getPurchaseState,
  purchaseState => purchaseState.filter,
);

import { createSelector } from 'reselect';

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
  const { page, unitTotalCount, order } = purchaseState;
  return {
    currentPage: page,
    totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT),
    order,
  };
});

export const getPage = createSelector(
  getPurchaseState,
  purchaseState => purchaseState.page,
);

export const getOrder = createSelector(
  getPurchaseState,
  purchaseState => purchaseState.order,
);

export const getFilterOptions = createSelector(
  getPurchaseState,
  purchaseState => purchaseState.filter.options,
);

export const getFilter = createSelector(
  getPurchaseState,
  purchaseState => purchaseState.filter.selected,
);

export const getPurchaseOptions = createSelector(
  [getPage, getOrder, getFilter],
  (page, order, filter) => ({ page, order, filter }),
);

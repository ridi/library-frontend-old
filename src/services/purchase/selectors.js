import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { calcPage } from '../../utils/pagination';
import { MainOrderOptions } from '../../constants/orderOptions';

const getPurchaseState = state => state.purchase;

export const getItemsByPage = createSelector(
  getPurchaseState,
  purchaseState => {
    const { page } = purchaseState;
    return purchaseState.items[page] || [];
  },
);

export const getPageInfo = createSelector(getPurchaseState, purchaseState => {
  const {
    page,
    unitTotalCount,
    order,
    filter: { selected },
  } = purchaseState;
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  return {
    currentPage: page,
    totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    order,
    orderType,
    orderBy,
    filter: selected,
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

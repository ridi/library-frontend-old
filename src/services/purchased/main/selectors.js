import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';

const getPurchasedMainState = state => state.purchasedMain;

export const getItemsByPage = createSelector(getPurchasedMainState, purchasedMainState => {
  const { page } = purchasedMainState;
  return purchasedMainState.items[page] || [];
});

export const getPageInfo = createSelector(getPurchasedMainState, purchasedMainState => {
  const {
    page,
    unitTotalCount,
    order,
    filter: { selected },
  } = purchasedMainState;

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

export const getPage = createSelector(getPurchasedMainState, purchasedMainState => purchasedMainState.page);

export const getOrder = createSelector(getPurchasedMainState, purchasedMainState => purchasedMainState.order);

export const getFilterOptions = createSelector(getPurchasedMainState, purchasedMainState => purchasedMainState.filter.options);

export const getFilter = createSelector(getPurchasedMainState, purchasedMainState => purchasedMainState.filter.selected);

export const getPurchaseOptions = createSelector([getPage, getOrder, getFilter], (page, order, filter) => ({
  page,
  order,
  filter,
}));

export const getSelectedBooks = createSelector(getPurchasedMainState, purchasedMainState => purchasedMainState.selectedBooks);

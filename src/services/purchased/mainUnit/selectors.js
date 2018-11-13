import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';

const getPurchasedUnitState = state => state.purchasedUnit;

export const getItemsByPage = createSelector(getPurchasedUnitState, purchasedUnitState => {
  const { page } = purchasedUnitState;
  return purchasedUnitState.items[page] || [];
});

export const getPageInfo = createSelector(getPurchasedUnitState, purchasedUnitState => {
  const {
    unitId,
    page,
    unitTotalCount,
    order,
    filter: { selected },
  } = purchasedUnitState;

  const { orderType, orderBy } = MainOrderOptions.parse(order);

  return {
    unitId,
    currentPage: page,
    totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    order,
    orderType,
    orderBy,
    filter: selected,
  };
});

export const getUnitId = createSelector(getPurchasedUnitState, purchasedUnitState => purchasedUnitState.unitId);

export const getPage = createSelector(getPurchasedUnitState, purchasedUnitState => purchasedUnitState.page);

export const getOrder = createSelector(getPurchasedUnitState, purchasedUnitState => purchasedUnitState.order);

export const getFilterOptions = createSelector(getPurchasedUnitState, purchasedUnitState => purchasedUnitState.filter.options);

export const getFilter = createSelector(getPurchasedUnitState, purchasedUnitState => purchasedUnitState.filter.selected);

export const getPurchasedUnitOptions = createSelector([getUnitId, getPage, getOrder, getFilter], (unitId, page, order, filter) => ({
  unitId,
  page,
  order,
  filter,
}));

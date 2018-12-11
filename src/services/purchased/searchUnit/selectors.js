import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';

const getState = state => state.purchasedSearchUnit;

export const getItems = createSelector(
  getState,
  state => state.items,
);

export const getItemsByPage = createSelector(
  getState,
  state => {
    const { page, itemIdsForPage, items } = state;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getPageInfo = createSelector(
  getState,
  state => {
    const {
      unitId,
      page,
      unitTotalCount,
      order,
      filter: { selected },
    } = state;

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
  },
);

export const getUnitId = createSelector(
  getState,
  state => state.unitId,
);

export const getPage = createSelector(
  getState,
  state => state.page,
);

export const getOrder = createSelector(
  getState,
  state => state.order,
);

export const getFilterOptions = createSelector(
  getState,
  state => state.filter.options,
);

export const getFilter = createSelector(
  getState,
  state => state.filter.selected,
);

export const getOptions = createSelector(
  [getUnitId, getPage, getOrder, getFilter],
  (unitId, page, order, filter) => ({
    unitId,
    page,
    order,
    filter,
  }),
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

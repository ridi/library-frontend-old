import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';

const getState = state => state.purchasedSearchUnit;

export const getItemsByPage = createSelector(
  getState,
  state => {
    const { page, itemIdsForPage, items } = state;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getUnit = createSelector(
  getState,
  state => state.unit,
);

export const getPageInfo = createSelector(
  getState,
  state => {
    const { unitId, page, itemTotalCount, order, keyword } = state;
    const { orderType, orderBy } = MainOrderOptions.parse(order);

    return {
      unitId,
      currentPage: page,
      totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      order,
      orderType,
      orderBy,
      keyword,
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

export const getKeyword = createSelector(
  getState,
  state => state.keyword,
);

export const getOptions = createSelector(
  [getUnitId, getPage, getOrder, getKeyword],
  (unitId, page, order, keyword) => ({
    unitId,
    page,
    order,
    keyword,
  }),
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getTotalCount = createSelector(
  getState,
  state => {
    return { itemTotalCount: state.itemTotalCount };
  },
);

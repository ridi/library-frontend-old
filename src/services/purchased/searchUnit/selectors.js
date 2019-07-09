import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { OrderOptions } from '../../../constants/orderOptions';
import { initialDataState, getKey } from './state';

const getState = state => state.purchasedSearchUnit;
const getDataState = state => {
  const searchUnitState = state.purchasedSearchUnit;
  const key = getKey(searchUnitState);
  return searchUnitState.data[key] || initialDataState;
};

export const getItemsByPage = createSelector(
  getDataState,
  dataState => {
    const { page, itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getPrimaryItem = createSelector(
  getState,
  state => state.primaryItems[state.unitId],
);

export const getPageInfo = createSelector(
  [getState, getDataState],
  (state, dataState) => {
    const { unitId, order, keyword } = state;
    const { page, itemTotalCount } = dataState;
    const { orderType, orderBy } = OrderOptions.parse(order);

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
  getDataState,
  dataState => dataState.page,
);

export const getOrder = createSelector(
  getState,
  state => state.order,
);

export const getOptions = createSelector(
  [getUnitId, getPage, getOrder],
  (unitId, page, order) => ({
    unitId,
    page,
    order,
  }),
);

export const getTotalCount = createSelector(
  getDataState,
  dataState => ({ itemTotalCount: dataState.itemTotalCount, purchasedTotalCount: dataState.purchasedTotalCount }),
);

export const getIsFetchingBook = createSelector(
  getState,
  state => state.isFetchingBook,
);

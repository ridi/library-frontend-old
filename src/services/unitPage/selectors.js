import { createSelector } from 'reselect';
import { OrderOptions } from '../../constants/orderOptions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { concat } from '../../utils/array';
import { calcPage } from '../../utils/pagination';
import { createInitialDataState } from './state';

const getDataState = (state, options) => {
  const order = OrderOptions.toKey(options.orderType, options.orderBy);
  const key = concat([options.unitId, order]);
  return state.unitPage.data[key] || createInitialDataState();
};

export const getItemsByPage = createSelector(
  getDataState,
  dataState => {
    const { page, itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getPrimaryItem = (state, unitId) => state.unitPage.primaryItems[unitId];

export const getTotalPages = createSelector(
  getDataState,
  dataState => calcPage(dataState.itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
);

export const getTotalCount = createSelector(
  getDataState,
  dataState => ({ itemTotalCount: dataState.itemTotalCount, purchasedTotalCount: dataState.purchasedTotalCount }),
);

export const getIsFetchingBook = state => state.unitPage.isFetchingBook;

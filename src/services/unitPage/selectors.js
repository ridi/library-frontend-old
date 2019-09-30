import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { OrderOptions } from '../../constants/orderOptions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { concat } from '../../utils/array';
import { calcPage } from '../../utils/pagination';
import { createInitialDataState } from './state';

function makeKeyFromOptions({ unitId, orderType, orderBy }) {
  const order = OrderOptions.toKey(orderType, orderBy);
  return concat([unitId, order]);
}

const getDataState = createCachedSelector(
  state => state.unitPage,
  (_, options) => makeKeyFromOptions(options),
  (unitPage, key) => unitPage.data[key] || createInitialDataState(),
)((_, options) => makeKeyFromOptions(options));

export const getItemsByPage = createSelector(
  getDataState,
  (_, options) => options.page,
  (dataState, page) => {
    const { itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page];
    return itemIds && itemIds.map(itemId => items[itemId]);
  },
);

export const getPrimaryItem = (state, kind, unitId) => state.unitPage.primaryItems[`${kind}${unitId}`];

export const getTotalPages = createSelector(
  getDataState,
  dataState => calcPage(dataState.itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
);

export const getTotalCount = createSelector(
  getDataState,
  dataState => ({ itemTotalCount: dataState.itemTotalCount, purchasedTotalCount: dataState.purchasedTotalCount }),
);

export const getIsFetchingBook = state => state.unitPage.isFetchingBook;

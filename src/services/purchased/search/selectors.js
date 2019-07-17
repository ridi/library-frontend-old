import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { createInitialDataState, mapPageOptionsToKey } from './state';

const getDataState = createCachedSelector(
  state => state.purchasedSearch.data,
  (_, pageOptions) => mapPageOptionsToKey(pageOptions),
  (data, key) => data[key] || createInitialDataState(),
)((_, pageOptions) => mapPageOptionsToKey(pageOptions));

export const getItems = createSelector(
  getDataState,
  dataState => dataState.items,
);

export const getItemsByPage = createCachedSelector(
  getDataState,
  (_, pageOptions) => pageOptions.page,
  (dataState, page) => {
    const { itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
)((_, pageOptions) => pageOptions.page);

export const getTotalPages = createSelector(
  getDataState,
  dataState => calcPage(dataState.unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
);

export const getIsFetchingBooks = state => state.purchasedSearch.isFetchingBooks;

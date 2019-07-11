import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getState = state => state.purchasedHidden;

export const getItems = createSelector(
  getState,
  state => state.items,
);

export const getItemsByPage = createCachedSelector(
  state => state.purchasedHidden.itemIdsForPage,
  state => state.purchasedHidden.items,
  (_, page) => page,
  (itemIdsForPage, items, page) => {
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
)((_, page) => page);

export const getTotalPages = createSelector(
  state => state.purchasedHidden.unitTotalCount,
  unitTotalCount => calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
);

export const getTotalCount = createSelector(
  getState,
  state => ({ unitTotalCount: state.unitTotalCount, itemTotalCount: state.itemTotalCount }),
);

export const getIsFetchingBooks = createSelector(
  getState,
  state => state.isFetchingBooks,
);

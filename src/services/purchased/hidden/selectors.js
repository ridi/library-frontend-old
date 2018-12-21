import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getState = state => state.purchasedHidden;

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
    const { page, itemTotalCount } = state;
    return {
      currentPage: page,
      totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    };
  },
);

export const getPage = createSelector(
  getState,
  state => state.page,
);

export const getOptions = createSelector(
  [getPage],
  page => ({
    page,
  }),
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getTotalCount = createSelector(
  getState,
  state => {
    return { unitTotalCount: state.unitTotalCount, itemTotalCount: state.itemTotalCount };
  },
);

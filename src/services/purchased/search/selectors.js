import { createSelector } from 'reselect';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getState = state => state.purchasedSearch;

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

export const getSearchPageInfo = createSelector(
  getState,
  state => {
    const { keyword, page, unitTotalCount } = state;

    return {
      currentPage: page,
      totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      keyword,
    };
  },
);

export const getPage = createSelector(
  getState,
  state => state.page,
);

export const getKeyword = createSelector(
  getState,
  state => state.keyword,
);

export const getOptions = createSelector(
  [getPage, getKeyword],
  (page, keyword) => ({ page, keyword }),
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getIsFetchingBooks = createSelector(
  getState,
  state => state.isFetchingBooks,
);

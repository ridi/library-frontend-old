import { createSelector } from 'reselect';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { getDataState as getDataStateUtil } from '../../../utils/state';
import { initialDataState } from './state';

const getState = state => state.purchasedSearch;
const getDataState = state => {
  const searchState = state.purchasedSearch;
  const { dataState } = getDataStateUtil(searchState, [searchState.keyword], initialDataState);
  return dataState;
};

export const getItems = createSelector(
  getDataState,
  dataState => dataState.items,
);

export const getItemsByPage = createSelector(
  getDataState,
  dataState => {
    const { page, itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getSearchPageInfo = createSelector(
  [getState, getDataState],
  (state, dataState) => {
    const { keyword } = state;
    const { page, unitTotalCount } = dataState;

    return {
      currentPage: page,
      totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      keyword,
    };
  },
);

export const getPage = createSelector(
  getDataState,
  dataState => dataState.page,
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

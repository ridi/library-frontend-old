import { createSelector } from 'reselect';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getPurchasedSearchState = state => state.purchasedSearch;

export const getSearchItems = createSelector(getPurchasedSearchState, purchasedSearchState => purchasedSearchState.items);

export const getSearchItemsByPage = createSelector(getPurchasedSearchState, purchasedSearchState => {
  const { page, itemIdsForPage, items } = purchasedSearchState;
  const itemIds = itemIdsForPage[page] || [];
  return itemIds.map(itemId => items[itemId]);
});

export const getSearchPageInfo = createSelector(getPurchasedSearchState, purchasedSearchState => {
  const { keyword, page, unitTotalCount } = purchasedSearchState;

  return {
    currentPage: page,
    totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    keyword,
  };
});

export const getPage = createSelector(getPurchasedSearchState, purchasedSearchState => purchasedSearchState.page);

export const getKeyword = createSelector(getPurchasedSearchState, purchasedSearchState => purchasedSearchState.keyword);

export const getSearchOptions = createSelector([getPage, getKeyword], (page, keyword) => ({ page, keyword }));

export const getSelectedSearchBooks = createSelector(getPurchasedSearchState, purchasedSearchState => purchasedSearchState.selectedBooks);

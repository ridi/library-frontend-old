import { createSelector } from 'reselect';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getPurchasedSearchState = state => state.purchasedSearch;

export const getSearchItemsByPage = createSelector(getPurchasedSearchState, purchasedSearchState => {
  const { page } = purchasedSearchState;
  return purchasedSearchState.items[page] || [];
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

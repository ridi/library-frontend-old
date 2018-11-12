import { createSelector } from 'reselect';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { calcPage } from '../../utils/pagination';

const getSearchState = state => state.search;

export const getSearchItemsByPage = createSelector(
  getSearchState,
  searchState => {
    const { page } = searchState;
    return searchState.items[page] || [];
  },
);

export const getSearchPageInfo = createSelector(getSearchState, searchState => {
  const { keyword, page, unitTotalCount } = searchState;

  return {
    currentPage: page,
    totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    keyword,
  };
});

export const getPage = createSelector(
  getSearchState,
  searchState => searchState.page,
);

export const getKeyword = createSelector(
  getSearchState,
  searchState => searchState.keyword,
);

export const getSearchOptions = createSelector(
  [getPage, getKeyword],
  (page, keyword) => ({ page, keyword }),
);

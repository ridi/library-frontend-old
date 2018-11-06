import { createSelector } from 'reselect';

const getSearchState = state => state.search;

export const getPageInfo = createSelector(getSearchState, searchState => ({
  page: searchState.page,
  keyword: searchState.keyword,
}));

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

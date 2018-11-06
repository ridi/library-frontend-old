import { createSelector } from 'reselect';

const getSearchState = state => state.search;

export const getPageInfo = createSelector(getSearchState, searchState => ({
  page: searchState.page,
  keyword: searchState.keyword,
}));

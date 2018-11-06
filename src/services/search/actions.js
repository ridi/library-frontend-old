export const LOAD_SEARCH_PAGE = 'LOAD_SEARCH_PAGE';

export const SET_SEARCH_ITEMS = 'SET_SEARCH_ITEMS';
export const SET_SEARCH_TOTAL_COUNT = 'SET_SEARCH_TOTAL_COUNT';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';

export const loadSearchPage = () => ({
  type: LOAD_SEARCH_PAGE,
});

export const setSearchItems = items => ({
  type: SET_SEARCH_ITEMS,
  payload: {
    items,
  },
});

export const setSearchTotalCount = (unitTotalCount, itemTotalCount) => ({
  type: SET_SEARCH_TOTAL_COUNT,
  payload: {
    unitTotalCount,
    itemTotalCount,
  },
});

export const setSearchPage = page => ({
  type: SET_SEARCH_PAGE,
  payload: {
    page,
  },
});

export const setSearchKeyword = keyword => ({
  type: SET_SEARCH_KEYWORD,
  payload: {
    keyword,
  },
});

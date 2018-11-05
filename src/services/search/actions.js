export const LOAD_SEARCH_PAGE = 'LOAD_SEARCH_PAGE';

export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';

export const loadSearchPage = () => ({
  type: LOAD_SEARCH_PAGE,
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

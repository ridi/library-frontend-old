import { concat } from '../../../utils/array';

export const initialState = {
  keyword: null,
  data: {},

  selectedBooks: {},
  isFetchingBooks: false,
};

export const initialDataState = {
  itemIdsForPage: {},
  items: {},
  page: 1,

  unitTotalCount: 0,
  itemTotalCount: 0,
};

export const getKey = state => concat([state.keyword]);

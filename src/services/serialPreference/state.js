const _DEFAULT_KEY = 'ALL';

export const initialState = {
  data: {},
  unitIdMap: {},

  isFetchingBooks: false,
};

export const initialDataState = {
  itemIdsForPage: {},
  items: {},

  page: 1,
  totalCount: 0,
};

export const getKey = () => _DEFAULT_KEY;

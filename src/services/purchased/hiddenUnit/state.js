export const initialState = {
  unitId: null,
  data: {},
  selectedBooks: {},
  isFetchingBook: false,
};

export const initialDataState = {
  primaryItem: null,
  items: {},
  itemIdsForPage: {},

  page: 1,
  itemTotalCount: 0,
};

export const getKey = state => state.unitId;

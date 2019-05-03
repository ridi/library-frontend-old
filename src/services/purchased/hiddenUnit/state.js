export const initialState = {
  unitId: null,
  data: {},
  primaryItems: {},
  isFetchingBook: false,
};

export const initialDataState = {
  items: {},
  itemIdsForPage: {},

  page: 1,
  itemTotalCount: 0,
};

export const getKey = state => state.unitId;

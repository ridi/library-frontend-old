import { concat } from '../../utils/array';

export const initialState = {
  primaryItems: {},
  data: {},
  isFetchingBook: false,
};

export const createInitialDataState = () => ({
  items: {},
  itemIdsForPage: {},

  page: 1,
  itemTotalCount: 0,
});

export const getKey = state => concat([state.unitId, state.order]);

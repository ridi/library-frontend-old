import { concat } from '../../../utils/array';

export const initialState = {
  unitId: null,
  keyword: null,
  data: {},

  units: {},
  order: 0,

  selectedBooks: {},
};

export const initialDataState = {
  itemIdsForPage: {},
  items: {},

  page: 1,
  itemTotalCount: 0,
};

export const getKey = state => concat([state.unitId, state.order]);

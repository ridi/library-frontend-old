import { concat } from '../../../utils/array';

export const initialState = {
  unitId: null,
  order: 0,

  data: {},
  units: {},

  selectedBooks: {},
};

export const initialDataState = {
  itemIdsForPage: {},
  items: {},

  page: 1,
  itemTotalCount: 0,
};

export const getKey = state => concat([state.unitId, state.order]);

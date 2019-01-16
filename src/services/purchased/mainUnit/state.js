import { concat } from '../../../utils/array';

export const initialState = {
  unitId: null,
  data: {},

  order: 0,
  selectedBooks: {},
  isFetchingBook: false,
};

export const initialDataState = {
  items: [],

  page: 0,
  itemTotalCount: 0,
};

export const getKey = state => concat([state.unitId, state.order]);

import { OrderOptions } from '../../../constants/orderOptions';
import { concat } from '../../../utils/array';

export const initialState = {
  unitId: null,
  keyword: null,
  data: {},
  primaryItems: {},

  order: OrderOptions.DEFAULT.key,
  selectedBooks: {},

  isFetchingBook: false,
};

export const initialDataState = {
  items: {},
  itemIdsForPage: {},

  page: 1,
  itemTotalCount: 0,
};

export const getKey = state => concat([state.unitId, state.order]);

import { OrderOptions } from '../../../constants/orderOptions';
import { concat } from '../../../utils/array';

export const initialState = {
  unitId: null,
  primaryItems: {},
  data: {},

  order: OrderOptions.UNIT_LIST_DEFAULT.key,
  isFetchingBook: false,
};

export const initialDataState = {
  items: {},
  itemIdsForPage: {},

  page: 1,
  itemTotalCount: 0,
};

export const getKey = state => concat([state.unitId, state.order]);

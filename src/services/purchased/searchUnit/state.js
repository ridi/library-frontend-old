import { MainOrderOptions } from '../../../constants/orderOptions';

export const initialState = {
  itemIdsForPage: {},
  items: {},
  unit: {},
  order: MainOrderOptions.DEFAULT,

  page: 1,
  unitTotalCount: 0,
  itemTotalCount: 0,

  selectedBooks: {},
};

import { MainOrderOptions } from '../../../constants/orderOptions';

export const initialState = {
  itemIdsForPage: {},
  items: {},
  unit: {},
  order: MainOrderOptions.DEFAULT,
  keyword: '',

  page: 1,
  itemTotalCount: 0,

  selectedBooks: {},
};

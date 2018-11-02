import { MainOrderOptions } from '../../constants/orderOptions';

export const initialState = {
  items: {},
  order: MainOrderOptions.DEFAULT,
  filter: {
    options: [],
    selected: null,
  },

  page: 1,
  unitTotalCount: 0,
  itemTotalCount: 0,
};

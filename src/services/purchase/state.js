import { mainOrderOptions } from '../../constants/orderOptions';

export const initialState = {
  items: {},
  order: mainOrderOptions[0].value,
  filter: {
    options: [],
    selected: '',
  },

  page: 1,
  unitTotalCount: 0,
  itemTotalCount: 0,
};

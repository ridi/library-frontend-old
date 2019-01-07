import { MainOrderOptions } from '../../../constants/orderOptions';

export const initialState = {
  itemIdsForPage: {},
  items: {},
  order: MainOrderOptions.DEFAULT,
  filter: {
    options: [
      {
        title: '전체 카테고리',
        value: '',
        hasChildren: false,
        children: null,
      },
    ],
    selected: null,
  },

  page: 1,
  unitTotalCount: 0,
  itemTotalCount: 0,

  selectedBooks: {},

  isLoading: false,
};

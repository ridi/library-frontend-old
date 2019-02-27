import { concat } from '../../../utils/array';

export const initialState = {
  // 공용
  filter: {
    options: [
      {
        title: '전체 카테고리',
        value: null,
        hasChildren: false,
        children: null,
      },
    ],
    selected: null,
  },
  order: 'PURCHASE_DATE',
  data: {},

  selectedBooks: {},
  isFetchingBooks: false,
};

export const initialDataState = {
  itemIdsForPage: {},
  items: {},

  page: 1,
  unitTotalCount: 0,
  itemTotalCount: 0,
};

export const getKey = state => concat([state.filter.selected, state.order]);

import { OrderOptions } from '../../../constants/orderOptions';

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
  },
  data: {},
  isFetchingBooks: false,
};

export const createInitialDataState = () => ({
  itemIdsForPage: {},
  items: {},
  unitTotalCount: 0,
  itemTotalCount: 0,
});

export function mapPageOptionsToKey(pageOptions) {
  const { orderType, orderBy, categoryFilter } = pageOptions;
  const order = OrderOptions.toKey(orderType, orderBy);
  return `${categoryFilter}_${order}`;
}

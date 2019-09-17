import { OrderOptions } from '../../../constants/orderOptions';

export const initialState = {
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

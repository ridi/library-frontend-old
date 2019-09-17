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
  const { kind, keyword, orderType, orderBy, categoryFilter } = pageOptions;
  let key = '';
  if (kind === 'main') {
    const order = OrderOptions.toKey(orderType, orderBy);
    key = `${categoryFilter}_${order}`;
  } else if (kind === 'search') {
    key = keyword;
  }
  return `${kind}_${key}`;
}

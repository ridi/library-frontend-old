import { OrderOptions } from 'constants/orderOptions';
import { BooksPageKind } from 'constants/urls';

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
  if (kind === BooksPageKind.MAIN) {
    const order = OrderOptions.toKey(orderType, orderBy);
    key = `${categoryFilter}_${order}`;
  } else if (kind === BooksPageKind.SEARCH) {
    key = keyword;
  }
  return `${kind}_${key}`;
}

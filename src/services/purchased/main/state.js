import { OrderOptions } from 'constants/orderOptions';
import { BooksPageKind } from 'constants/urls';

export const initialState = {
  data: {},
};

export const createInitialDataState = () => ({
  itemIdsForPage: {},
  items: {},
  unitTotalCount: 0,
  itemTotalCount: 0,
});

export function mapPageOptionsToKey(pageOptions) {
  const { kind, keyword, orderBy, orderDirection, filter } = pageOptions;
  let key = '';
  if (kind === BooksPageKind.MAIN) {
    const order = OrderOptions.toKey(orderBy, orderDirection);
    key = order;
  } else if (kind === BooksPageKind.SEARCH) {
    key = keyword;
  }
  return `${kind}_${filter}_${key}`;
}

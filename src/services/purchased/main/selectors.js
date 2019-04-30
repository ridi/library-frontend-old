import { createSelector } from 'reselect';

import { OrderOptions } from '../../../constants/orderOptions';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { toFlatten } from '../../../utils/array';
import { calcPage } from '../../../utils/pagination';
import { initialDataState, getKey } from './state';

import { getBooks } from '../../book/selectors';

const getState = state => state.purchasedMain;
const getDataState = state => {
  const mainState = state.purchasedMain;
  const key = getKey(mainState);
  return mainState.data[key] || initialDataState;
};

export const getItems = createSelector(
  getDataState,
  dataState => dataState.items,
);

export const getItemsByPage = createSelector(
  getDataState,
  dataState => {
    const { page, itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getBookIdsByPage = createSelector(
  getItemsByPage,
  items => toFlatten(items, 'b_id'),
);

export const getBooksByPage = createSelector(
  state => state,
  getBookIdsByPage,
  getBooks,
);

export const getUnitIdsByPage = createSelector(
  getItemsByPage,
  items => toFlatten(items, 'unit_id'),
);

export const getLastBookIdsByPage = createSelector(
  getBooksByPage,
  books => toFlatten(Object.values(books), 'series.property.opened_last_volume_id', true),
);

export const getTotalPages = createSelector(
  getDataState,
  dataState => calcPage(dataState.unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
);

export const getPage = createSelector(
  getDataState,
  dataState => dataState.page,
);

export const getOrder = createSelector(
  getState,
  state => state.order,
);

export const getFilterOptions = createSelector(
  getState,
  state => state.filter.options,
);

export const getFilter = createSelector(
  getState,
  state => state.filter.selected,
);

export const getOptions = createSelector(
  [getPage, getOrder, getFilter],
  (page, order, filter) => ({
    page,
    order,
    filter,
  }),
);

export const getPageInfo = createSelector(
  getPage,
  getTotalPages,
  getOrder,
  getFilter,
  (currentPage, totalPages, order, filter) => {
    const { orderType, orderBy } = OrderOptions.parse(order);
    return {
      currentPage,
      totalPages,
      order,
      orderType,
      orderBy,
      filter,
    };
  },
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getIsFetchingBooks = createSelector(
  getState,
  state => state.isFetchingBooks,
);

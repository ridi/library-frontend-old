import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { concat } from '../../../utils/array';
import { initialDataState } from './state';

const getState = state => state.purchasedMain;
const getDataState = state => {
  const mainState = state.purchasedMain;
  const key = concat([mainState.filter.selected, mainState.order]);
  return mainState.data[key] || initialDataState;
};

export const getItems = createSelector(
  [getState, getDataState],
  (_, dataState) => dataState.items,
);

export const getItemsByPage = createSelector(
  [getState, getDataState],
  (_, dataState) => {
    const { page, itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getPageInfo = createSelector(
  [getState, getDataState],
  (state, dataState) => {
    const {
      order,
      filter: { selected },
    } = state;
    const { page, unitTotalCount } = dataState;

    const { orderType, orderBy } = MainOrderOptions.parse(order);

    return {
      currentPage: page,
      totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      order,
      orderType,
      orderBy,
      filter: selected,
    };
  },
);

export const getPage = createSelector(
  [getState, getDataState],
  (_, dataState) => dataState.page,
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

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getIsFetchingBooks = createSelector(
  getState,
  state => state.isFetchingBooks,
);

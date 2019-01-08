import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { getDataState as getDataStateUtil } from '../../../utils/state';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { initialDataState } from './state';

const getState = state => state.purchasedMain;
const getDataState = state => {
  const mainState = state.purchasedMain;
  const { dataState } = getDataStateUtil(mainState, [mainState.filter.selected, mainState.order], initialDataState);
  return dataState;
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

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getIsFetchingBooks = createSelector(
  getState,
  state => state.isFetchingBooks,
);

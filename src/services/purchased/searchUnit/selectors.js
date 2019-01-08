import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { getDataState as getDataStateUtil } from '../../../utils/state';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { initialDataState } from './state';

const getState = state => state.purchasedSearchUnit;
const getDataState = state => {
  const searchUnitState = state.purchasedSearchUnit;
  const { dataState } = getDataStateUtil(searchUnitState, [searchUnitState.unitId, searchUnitState.order], initialDataState);
  return dataState;
};

export const getItemsByPage = createSelector(
  getDataState,
  dataState => {
    const { page, itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getUnit = createSelector(
  getState,
  state => state.units[state.unitId],
);

export const getPageInfo = createSelector(
  [getState, getDataState],
  (state, dataState) => {
    const { unitId, order, keyword } = state;
    const { page, itemTotalCount } = dataState;
    const { orderType, orderBy } = MainOrderOptions.parse(order);

    return {
      unitId,
      currentPage: page,
      totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      order,
      orderType,
      orderBy,
      keyword,
    };
  },
);

export const getUnitId = createSelector(
  getState,
  state => state.unitId,
);

export const getPage = createSelector(
  getDataState,
  dataState => dataState.page,
);

export const getOrder = createSelector(
  getState,
  state => state.order,
);

export const getKeyword = createSelector(
  getState,
  state => state.keyword,
);

export const getOptions = createSelector(
  [getUnitId, getPage, getOrder, getKeyword],
  (unitId, page, order, keyword) => ({
    unitId,
    page,
    order,
    keyword,
  }),
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getTotalCount = createSelector(
  getDataState,
  dataState => ({ itemTotalCount: dataState.itemTotalCount }),
);

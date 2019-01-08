import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { getDataState as getDataStateUtil } from '../../../utils/state';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { initialDataState } from './state';

const getState = state => state.purchasedMainUnit;
const getDataState = state => {
  const mainUnitState = state.purchasedMainUnit;
  const { dataState } = getDataStateUtil(mainUnitState, [mainUnitState.unitId, mainUnitState.order], initialDataState);
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
    const { unitId, order } = state;
    const { page, itemTotalCount } = dataState;

    // TODO: Series 혹은 Collection 정렬 옵션 사용하기
    const { orderType, orderBy } = MainOrderOptions.parse(order);

    return {
      unitId,
      currentPage: page,
      totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      order,
      orderType,
      orderBy,
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

export const getOptions = createSelector(
  [getUnitId, getPage, getOrder],
  (unitId, page, order) => ({
    unitId,
    page,
    order,
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

import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { getKey, initialDataState } from './state';

const getState = state => state.purchasedHiddenUnit;
const getDataState = state => {
  const hiddenUnitState = state.purchasedHiddenUnit;
  const key = getKey(hiddenUnitState);
  return hiddenUnitState.data[key] || initialDataState;
};

export const getItemsByPage = createSelector(
  getDataState,
  dataState => {
    const { page, itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getPrimaryItem = createSelector(
  getState,
  state => state.primaryItems[state.unitId],
);

export const getPageInfo = createSelector(
  [getState, getDataState],
  (state, dataState) => {
    const { unitId } = state;
    const { page, itemTotalCount } = dataState;

    return {
      unitId,
      currentPage: page,
      totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
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

export const getOptions = createSelector(
  [getUnitId, getPage],
  (unitId, page) => ({
    unitId,
    page,
  }),
);

export const getTotalCount = createSelector(
  getDataState,
  dataState => ({
    itemTotalCount: dataState.itemTotalCount,
  }),
);

export const getIsFetchingBook = createSelector(
  getState,
  state => state.isFetchingBook,
);

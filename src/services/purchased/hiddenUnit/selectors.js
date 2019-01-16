import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getState = state => state.purchasedHiddenUnit;

export const getItems = createSelector(
  getState,
  state => state.items,
);

export const getPageInfo = createSelector(
  getState,
  state => {
    const { unitId, page, itemTotalCount } = state;

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
  getState,
  state => state.page,
);

export const getOptions = createSelector(
  [getUnitId, getPage],
  (unitId, page) => ({
    unitId,
    page,
  }),
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getTotalCount = createSelector(
  getState,
  state => ({
    itemTotalCount: state.itemTotalCount,
  }),
);

export const getIsFetchingBook = createSelector(
  getState,
  state => state.isFetchingBook,
);

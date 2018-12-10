import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';

const getMainState = state => state.purchasedMain;

export const getItems = createSelector(
  getMainState,
  mainState => mainState.items,
);

export const getItemsByPage = createSelector(
  getMainState,
  mainState => {
    const { page, itemIdsForPage, items } = mainState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getPageInfo = createSelector(
  getMainState,
  mainState => {
    const {
      page,
      unitTotalCount,
      order,
      filter: { selected },
    } = mainState;

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
  getMainState,
  mainState => mainState.page,
);

export const getOrder = createSelector(
  getMainState,
  mainState => mainState.order,
);

export const getFilterOptions = createSelector(
  getMainState,
  mainState => mainState.filter.options,
);

export const getFilter = createSelector(
  getMainState,
  mainState => mainState.filter.selected,
);

export const getMainOptions = createSelector(
  [getPage, getOrder, getFilter],
  (page, order, filter) => ({
    page,
    order,
    filter,
  }),
);

export const getSelectedBooks = createSelector(
  getMainState,
  mainState => mainState.selectedBooks,
);

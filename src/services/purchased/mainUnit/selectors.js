import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';

const getMainUnitState = state => state.purchasedMainUnit;

export const getItemsByPage = createSelector(
  getMainUnitState,
  mainUnitState => {
    const { page } = mainUnitState;
    return mainUnitState.items[page] || [];
  },
);

export const getPageInfo = createSelector(
  getMainUnitState,
  mainUnitState => {
    const {
      unitId,
      page,
      unitTotalCount,
      order,
      filter: { selected },
    } = mainUnitState;

    const { orderType, orderBy } = MainOrderOptions.parse(order);

    return {
      unitId,
      currentPage: page,
      totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      order,
      orderType,
      orderBy,
      filter: selected,
    };
  },
);

export const getUnitId = createSelector(
  getMainUnitState,
  mainUnitState => mainUnitState.unitId,
);

export const getPage = createSelector(
  getMainUnitState,
  mainUnitState => mainUnitState.page,
);

export const getOrder = createSelector(
  getMainUnitState,
  mainUnitState => mainUnitState.order,
);

export const getFilterOptions = createSelector(
  getMainUnitState,
  mainUnitState => mainUnitState.filter.options,
);

export const getFilter = createSelector(
  getMainUnitState,
  mainUnitState => mainUnitState.filter.selected,
);

export const getMainUnitOptions = createSelector(
  [getUnitId, getPage, getOrder, getFilter],
  (unitId, page, order, filter) => ({
    unitId,
    page,
    order,
    filter,
  }),
);

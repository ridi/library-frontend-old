import { createSelector } from 'reselect';

import { SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { calcPage } from '../../utils/pagination';
import { initialDataState, getKey } from './state';

const getState = state => state.serialPreference;
const getDataState = state => {
  const mainState = state.serialPreference;
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

export const getPageInfo = createSelector(
  [getState, getDataState],
  (state, dataState) => {
    const { page, totalCount } = dataState;

    return {
      currentPage: page,
      totalPages: calcPage(totalCount, SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE),
    };
  },
);

export const getPage = createSelector(
  getDataState,
  dataState => dataState.page,
);

export const getOptions = createSelector(
  [getPage],
  page => ({
    page,
  }),
);

export const getTotalCount = createSelector(
  getDataState,
  dataState => dataState.totalCount,
);

export const getIsFetchingBooks = createSelector(
  getState,
  state => state.isFetchingBooks,
);

export const getUnitIdsMap = (state, bookIds) =>
  createSelector(
    getState,
    state =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = state.unitIdMap[bookId];
        return previous;
      }, {}),
  )(state);

import { createSelector } from 'reselect';
import { getKey, initialDataState } from './state';

const getState = state => state.serialPreference;
const getDataState = state => {
  const mainState = state.serialPreference;
  const key = getKey(mainState);
  return mainState.data[key] || initialDataState;
};

export const getItemsByPage = (state, currentPage) =>
  createSelector(
    getDataState,
    dataState => {
      const { itemIdsForPage, items } = dataState;
      const itemIds = itemIdsForPage[currentPage] || [];
      return itemIds.map(itemId => items[itemId]);
    },
  )(state);

export const getTotalCount = createSelector(
  getDataState,
  dataState => dataState.totalCount,
);

export const getIsFetchingBooks = createSelector(
  getState,
  serialPrefereneceState => serialPrefereneceState.isFetchingBooks,
);

export const getUnitIdsMap = (state, bookIds) =>
  createSelector(
    getState,
    serialPrefereneceState =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = serialPrefereneceState.unitIdMap[bookId];
        return previous;
      }, {}),
  )(state);

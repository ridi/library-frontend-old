import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { createInitialDataState, getKey } from './state';

const getDataState = state => {
  const mainState = state.serialPreference;
  const key = getKey(mainState);
  return mainState.data[key] || createInitialDataState();
};

export const getItemsByPage = createCachedSelector(
  getDataState,
  (_, page) => page,
  (dataState, page) => {
    const { itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
)((_, page) => page);

export const getTotalCount = createSelector(
  getDataState,
  dataState => dataState.totalCount,
);

export const getIsFetchingBooks = state => state.serialPreference.isFetchingBooks;

export const getUnitIdsMap = createCachedSelector(
  state => state.serialPreference.unitIdMap,
  (_, bookIds) => bookIds,
  (unitIdMap, bookIds) =>
    bookIds.reduce((previous, bookId) => {
      previous[bookId] = unitIdMap[bookId];
      return previous;
    }, {}),
)((_, bookIds) => [...bookIds].sort().join(','));

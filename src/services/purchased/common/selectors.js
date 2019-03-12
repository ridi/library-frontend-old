import { createSelector } from 'reselect';

const getPurchasedCommonState = state => state.purchasedCommon;

export const getReadLatestData = (state, unitId) =>
  createSelector(
    getPurchasedCommonState,
    state => state.readLatestBookIds[unitId],
  )(state);

export const getFetchingReadLatest = createSelector(
  getPurchasedCommonState,
  state => state.fetchingReadLatest,
);

export const getRecentlyUpdatedData = (state, bookIds) =>
  createSelector(
    getPurchasedCommonState,
    state =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = state.recentlyUpdatedData[bookId];
        return previous;
      }, {}),
  )(state);

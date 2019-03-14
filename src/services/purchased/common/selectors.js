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
    commonState =>
      bookIds.reduce((previous, bookId) => {
        previous[bookId] = commonState.recentlyUpdatedData[bookId];
        return previous;
      }, {}),
  )(state);

export const getPrimaryBookId = (state, unitId) =>
  createSelector(
    getState,
    commonState => commonState.primaryBookIds[unitId],
  )(state);

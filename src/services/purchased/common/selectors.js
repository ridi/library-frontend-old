import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

const getPurchasedCommonState = state => state.purchasedCommon;

export const getReadLatestData = (state, unitId) =>
  createSelector(getPurchasedCommonState, _state => _state.readLatestBookIds[unitId])(state);

export const getFetchingReadLatest = createSelector(getPurchasedCommonState, state => state.fetchingReadLatest);

export const getIsRecentlyUpdated = (state, bookId) => Boolean(state.purchasedCommon.recentlyUpdatedData[bookId]);

export const getRecentlyUpdatedData = createCachedSelector(
  state => state.purchasedCommon.recentlyUpdatedData,
  (state, bookIds) => bookIds,
  (recentlyUpdatedData, bookIds) =>
    bookIds.reduce((obj, bookId) => {
      obj[bookId] = recentlyUpdatedData[bookId];
      return obj;
    }, {}),
)((state, bookIds) => [...bookIds].sort().join(','));

export const getPrimaryBookId = (state, unitId) =>
  createSelector(getPurchasedCommonState, commonState => commonState.primaryBookIds[unitId])(state);

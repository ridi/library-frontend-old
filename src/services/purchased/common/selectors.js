import { createSelector } from 'reselect';

const getPurchasedCommonState = state => state.purchasedCommon;

export const getReadLatestBookId = (state, unitId) =>
  createSelector(
    getPurchasedCommonState,
    state => state.readLatestBookIds[unitId],
  )(state);

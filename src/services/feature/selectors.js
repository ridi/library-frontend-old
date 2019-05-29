import createCachedSelector from 're-reselect';

export const getIsFeatureEnabled = createCachedSelector(state => state.feature, (_, id) => id, (feature, id) => Boolean(feature[id]))(
  (_, id) => id,
);

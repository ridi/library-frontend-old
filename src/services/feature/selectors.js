import createCachedSelector from 're-reselect';

export const getIsFeatureEnabled = createCachedSelector(
  state => state.feature,
  (_, featureId) => featureId,
  (featureState, featureId) => (featureState[featureId] ? Boolean(featureState[featureId]) : null),
)((_, id) => id);

export const SET_FEATURE = 'SET_FEATURE';
export const CHECK_ALL_FEATURES = 'CHECK_ALL_FEATURES';

export const setFeature = (id, value) => ({
  type: SET_FEATURE,
  payload: {
    id,
    value,
  },
});

export const checkAllFeatures = () => ({
  type: CHECK_ALL_FEATURES,
});

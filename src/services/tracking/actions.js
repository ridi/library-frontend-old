export const LOCATION_CHANGE = 'LOCATION_CHANGE';

export const locationChange = url => ({
  type: LOCATION_CHANGE,
  payload: {
    url,
  },
});

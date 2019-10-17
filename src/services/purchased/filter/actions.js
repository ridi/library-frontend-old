export const SET_FILTER_OPTIONS = 'SET_FILTER_OPTIONS';

export const setFilterOptions = filterOptions => ({
  type: SET_FILTER_OPTIONS,
  payload: {
    filterOptions,
  },
});

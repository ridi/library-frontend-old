export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';
export const SET_FILTER_OPTIONS = 'SET_FILTER_OPTIONS';

export const updateCategories = () => ({
  type: UPDATE_CATEGORIES,
});

export const setFilterOptions = filterOptions => ({
  type: SET_FILTER_OPTIONS,
  payload: {
    filterOptions,
  },
});

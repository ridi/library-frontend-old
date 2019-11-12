export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';
export const UPDATE_SERVICE_TYPES = 'UPDATE_SERVICE_TYPES';
export const SET_CATEGORY_FILTER_OPTIONS = 'SET_CATEGORY_FILTER_OPTIONS';
export const SET_SERVICE_TYPE_FILTER_OPTIONS = 'SET_SERVICE_TYPE_FILTER_OPTIONS';

export const updateCategories = () => ({
  type: UPDATE_CATEGORIES,
});

export const updateServiceTypes = () => ({
  type: UPDATE_SERVICE_TYPES,
});

export const setCategoryFilterOptions = categoryFilterOptions => ({
  type: SET_CATEGORY_FILTER_OPTIONS,
  payload: {
    categoryFilterOptions,
  },
});

export const setServiceTypeFilterOptions = serviceTypeFilterOptions => ({
  type: SET_SERVICE_TYPE_FILTER_OPTIONS,
  payload: {
    serviceTypeFilterOptions,
  },
});

export const SET_VIEW_TYPE = 'SET_VIEW_TYPE';
export const SET_FULL_SCREEN_LOADING = 'SET_FULL_SCREEN_LOADING';
export const SET_IS_ERROR = 'SET_IS_ERROR';
export const SET_LOADING_READ_LATEST = 'SET_LOADING_READ_LATEST';

export const setFullScreenLoading = isLoading => ({
  type: SET_FULL_SCREEN_LOADING,
  payload: {
    isLoading,
  },
});

export const setViewType = viewType => ({
  type: SET_VIEW_TYPE,
  payload: {
    viewType,
  },
});

export const setError = isError => ({
  type: SET_IS_ERROR,
  payload: {
    isError,
  },
});

export const setLoadingReadLatest = loadingReadLatest => ({
  type: SET_LOADING_READ_LATEST,
  payload: {
    loadingReadLatest,
  },
});

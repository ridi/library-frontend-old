export const SET_FULL_SCREEN_LOADING = 'SET_FULL_SCREEN_LOADING';

export const setFullScreenLoading = isLoading => ({
  type: SET_FULL_SCREEN_LOADING,
  payload: {
    isLoading,
  },
});

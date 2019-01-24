export const SET_VIEW_TYPE = 'SET_VIEW_TYPE';

export const setViewType = viewType => ({
  type: SET_VIEW_TYPE,
  payload: {
    viewType,
  },
});

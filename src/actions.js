
export const SET_SHOWS = 'SET_SHOWS';

export const setShows = shows => ({
  type: SET_SHOWS,
  payload: {
    shows,
  }
});

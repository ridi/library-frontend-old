export const LOAD_SHOWS = 'LOAD_SHOWS';
export const SET_SHOWS = 'SET_SHOWS';

export const loadShows = () => ({
  type: LOAD_SHOWS,
});

export const setShows = shows => ({
  type: SET_SHOWS,
  payload: {
    shows,
  },
});

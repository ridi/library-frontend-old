
import fetch from 'isomorphic-unfetch'

import { setShows } from './actions';
import { wrap } from './utils/wrap';

export const fetchShows = wrap(async dispatch => {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.json();
  dispatch(setShows(data));
});

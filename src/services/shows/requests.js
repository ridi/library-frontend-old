
import fetch from 'isomorphic-unfetch'

export const fetchShows = async () => {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.json();
  return data;
};

import axios from 'axios';

export function* fetchShows() {
  const response = yield axios.get(
    'https://api.tvmaze.com/search/shows?q=batman',
  );
  return response.data;
}

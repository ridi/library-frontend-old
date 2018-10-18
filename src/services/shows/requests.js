
import { put } from 'redux-saga/effects';
import { getAPI } from "../../api/actions";


export function* fetchShows () {
  const api = yield put(getAPI());
  const response = yield api.get('https://api.tvmaze.com/search/shows?q=batman');
  return response.data;
};

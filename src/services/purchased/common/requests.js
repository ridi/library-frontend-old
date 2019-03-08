import { put } from 'redux-saga/effects';
import { getAPI } from '../../../api/actions';

import config from '../../../config';
import { makeURI } from '../../../utils/uri';
import { NotFoundReadLatestError } from './errors';

export function* fetchItems(bookIds) {
  const options = {
    b_ids: bookIds,
  };
  const api = yield put(getAPI());
  const response = yield api.post(makeURI(`/items`, {}, config.LIBRARY_API_BASE_URL), options);
  return response.data;
}

export function* fetchReadLatestBookId(seriesId) {
  const api = yield put(getAPI());

  try {
    const response = yield api.get(
      makeURI(`/api/user/reading-histories/series/${seriesId}/latest`, { simple: true }, config.STORE_API_BASE_URL),
    );
    return response.data.result;
  } catch (err) {
    if (err.response.status === 404) {
      throw new NotFoundReadLatestError();
    }
    throw err;
  }
}
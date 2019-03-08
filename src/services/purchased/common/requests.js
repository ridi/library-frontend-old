import { put } from 'redux-saga/effects';
import { getAPI } from '../../../api/actions';

import config from '../../../config';
import { makeURI } from '../../../utils/uri';

export function* fetchItems(bookIds) {
  const options = {
    b_ids: bookIds,
  };
  const api = yield put(getAPI());
  const response = yield api.post(makeURI(`/items`, {}, config.LIBRARY_API_BASE_URL), options);
  return response.data;
}

import { put } from 'redux-saga/effects';

import config from '../../config';
import { getAPI } from '../../api/actions';

import { makeURI } from '../../utils/uri';

export function* triggerDownload(bookIds) {
  const query = {
    b_ids: bookIds,
    preprocess: true,
  };

  const api = yield put(getAPI());
  const response = yield api.post(makeURI('/api/user_books/trigger_download', null, config.STORE_API_BASE_URL), query);
  return response.data;
}

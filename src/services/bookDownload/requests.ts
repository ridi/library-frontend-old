import { stringify } from 'qs';
import { put } from 'redux-saga/effects';
import * as R from 'runtypes';

import { makeURI } from 'utils/uri';

import { getAPI } from '../../api/actions';
import config from '../../config';
import { BookIds } from './reducers';

const RDownload = R.Record({
  b_ids: R.Array(R.String),
  result: R.Boolean,
  url: R.String,
});

export function* triggerDownload(bookIds: BookIds) {
  const query = {
    b_ids: bookIds,
    preprocess: true,
  };

  const api = yield put(getAPI());
  const response = yield api.post(makeURI('/api/user_books/trigger_download', {}, config.STORE_API_BASE_URL), stringify(query));
  const data = RDownload.check(response.data);

  return data;
}

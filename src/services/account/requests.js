import { put } from 'redux-saga/effects';
import { getAPI } from '../../api/actions';

import config from '../../config';
import { makeURI } from '../../utils/uri';

export function* fetchUserInfo() {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/accounts/me', {}, config.ACCOUNT_BASE_URL));
  return response.data.result;
}

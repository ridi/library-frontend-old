import { put } from 'redux-saga/effects';
import { getAPI } from '../../api/actions';

import config from '../../config';

export function* fetchUserInfo() {
  const api = yield put(getAPI());
  const response = yield api.get(`${config.ACCOUNT_BASE_URL}/accounts/me`);
  return response.data.result;
}


import { put } from 'redux-saga/effects';
import { getAPI } from "../../api/actions";

import config from '../../config';

export function* fetchUserInfo () {
  const api = yield put(getAPI());
  const data = yield api.get(`${config.ACCOUNT_BASE_URL}/accounts/me`);
  return data;
}

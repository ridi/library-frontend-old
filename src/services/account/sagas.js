import { all, call, put, takeEvery } from 'redux-saga/effects';

import { LOAD_USER_INFO, setUserInfo } from './actions';
import { fetchUserInfo } from './requests';

function* loadUserInfo() {
  const data = yield call(fetchUserInfo);
  yield put(setUserInfo(data));
}

export default function* accountRootSaga() {
  yield all([takeEvery(LOAD_USER_INFO, loadUserInfo)]);
}

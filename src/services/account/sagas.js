import { all, call, put, takeEvery, take, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { LOAD_USER_INFO, START_ACCOUNT_TRACKER, setUserInfo } from './actions';
import { fetchUserInfo } from './requests';

import Window, { LOCATION } from '../../utils/window';

function* loadUserInfo() {
  try {
    const userInfo = yield call(fetchUserInfo);
    yield put(setUserInfo(userInfo));
  } catch (e) {}
}

function* accountTracker() {
  const TRACK_DELAY_MILLISECS = 1000 * 60 * 3;
  yield take(START_ACCOUNT_TRACKER);
  while (true) {
    yield call(delay, TRACK_DELAY_MILLISECS);

    const userInfo = yield select(state => state.account.userInfo);

    try {
      const newUserInfo = yield call(fetchUserInfo);
      if (userInfo.idx !== newUserInfo.idx) {
        Window.get(LOCATION).reload();
      }
    } catch (e) {
      continue;
    }
  }
}

export default function* accountRootSaga() {
  yield all([accountTracker(), takeEvery(LOAD_USER_INFO, loadUserInfo)]);
}

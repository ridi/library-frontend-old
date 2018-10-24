import {
  all,
  call,
  put,
  takeEvery,
  take,
  fork,
  cancel,
  select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
  LOAD_USER_INFO,
  START_ACCOUNT_TRACKER,
  STOP_ACCOUNT_TRACKER,
  setUserInfo,
} from './actions';
import { fetchUserInfo } from './requests';

function* loadUserInfo() {
  const data = yield call(fetchUserInfo);
  yield put(setUserInfo(data));
}

function* track() {
  const TRACK_DELAY_MILLISECS = 1000 * 60 * 3;

  while (true) {
    yield call(delay, TRACK_DELAY_MILLISECS);

    const userInfo = yield select(state => state.account.userInfo);
    const newUserInfo = yield call(fetchUserInfo);

    if (userInfo.idx !== newUserInfo.idx) {
      window.location.reload();
    } else {
      yield put(setUserInfo(newUserInfo));
    }
  }
}

function* accountTracker() {
  while (yield take(START_ACCOUNT_TRACKER)) {
    const tracker = yield fork(track);
    yield take(STOP_ACCOUNT_TRACKER);
    yield cancel(tracker);
  }
}

export default function* accountRootSaga() {
  yield all([accountTracker(), takeEvery(LOAD_USER_INFO, loadUserInfo)]);
}

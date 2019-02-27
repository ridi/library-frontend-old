import { all, call, put, take, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { START_ACCOUNT_TRACKER, setUserInfo } from './actions';
import { fetchUserInfo } from './requests';

import Window, { LOCATION } from '../../utils/window';

export function* loadUserInfo() {
  const userInfo = yield call(fetchUserInfo);
  yield put(setUserInfo(userInfo));
}

function* accountTracker() {
  const TRACK_DELAY_MILLISECS = 1000 * 60 * 3;
  yield take(START_ACCOUNT_TRACKER);

  while (true) {
    yield call(delay, TRACK_DELAY_MILLISECS);

    let newUserInfo;
    try {
      newUserInfo = yield call(fetchUserInfo);
    } catch (e) {
      return;
    }

    const userInfo = yield select(state => state.account.userInfo);
    if (userInfo.idx !== newUserInfo.idx) {
      Window.get(LOCATION).reload();
    }
  }
}

export default function* accountRootSaga() {
  yield all([accountTracker()]);
}

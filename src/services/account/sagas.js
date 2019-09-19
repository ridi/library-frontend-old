import * as Sentry from '@sentry/browser';
import { all, call, delay, put, select } from 'redux-saga/effects';

import { setNeedLogin, setUserInfo } from './actions';
import { fetchUserInfo } from './requests';

export function* loadUserInfo() {
  let userInfo;
  try {
    userInfo = yield call(fetchUserInfo);
  } catch (e) {
    yield put(setNeedLogin());
    return null;
  }
  Sentry.configureScope(scope => {
    scope.setUser({
      id: userInfo.idx,
      username: userInfo.id,
      email: userInfo.email,
    });
  });
  yield put(setUserInfo(userInfo));
  return userInfo;
}

function* accountTracker() {
  const TRACK_DELAY_MILLISECS = 1000 * 60 * 3;

  if (yield call(loadUserInfo)) {
    while (true) {
      yield delay(TRACK_DELAY_MILLISECS);

      let newUserInfo;
      try {
        newUserInfo = yield call(fetchUserInfo);
      } catch (e) {
        return;
      }

      const userInfo = yield select(state => state.account.userInfo);
      if (userInfo && userInfo.idx !== newUserInfo.idx) {
        window.location.reload();
      }
    }
  }
}

export default function* accountRootSaga() {
  yield all([accountTracker()]);
}

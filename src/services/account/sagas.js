import Router from 'next/router';
import { parse } from 'qs';

import { all, call, put, takeEvery, take, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { LOAD_USER_INFO, START_ACCOUNT_TRACKER, setUserInfo } from './actions';
import { fetchUserInfo } from './requests';

import Window, { LOCATION } from '../../utils/window';
import { makeLinkProps } from '../../utils/uri';
import { URLMap, toURLMap } from '../../constants/urls';

function loadActualPage() {
  const _location = Window.get(LOCATION);
  const { pathname } = _location;

  const { href, as } = toURLMap(pathname);
  const query = parse(_location.search, { charset: 'utf-8', ignoreQueryPrefix: true });
  const linkProps = makeLinkProps(href, as, query);
  Router.replace(linkProps.href, linkProps.as);
}

function* loadUserInfo() {
  let userInfo;

  // Step 1. 로그인이 되어 있는지 API 를 통해 확인하다.
  try {
    userInfo = yield call(fetchUserInfo);
  } catch (e) {
    // Step 2. 로그인 안되어 있다면 로그인 페이지 로드하고 종료
    if (URLMap.login.regex.exec(Window.get(LOCATION).pathname)) {
      loadActualPage();
    }
    return;
  }

  // Step 3. 로그인 되어 있는데 로그인 페이지에 있다면 모든 책으로 이동한다.
  if (URLMap.login.regex.exec(Window.get(LOCATION).pathname)) {
    Router.replace(URLMap.main.href, URLMap.main.as);
    return;
  }

  // Stpe 4. 실제 페이지로 이동
  yield put(setUserInfo(userInfo));
  loadActualPage();
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
  yield all([accountTracker(), takeEvery(LOAD_USER_INFO, loadUserInfo)]);
}

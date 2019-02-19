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

  if (pathname === '/login/') {
    Router.replace(URLMap.main.href, URLMap.main.as);
    return;
  }

  const { href, as } = toURLMap(pathname);
  const query = parse(_location.search, { charset: 'utf-8', ignoreQueryPrefix: true });
  const linkProps = makeLinkProps(href, as, query);
  Router.replace(linkProps.href, linkProps.as);
}

function* loadUserInfo() {
  try {
    const userInfo = yield call(fetchUserInfo);
    yield put(setUserInfo(userInfo));
    loadActualPage();
  } catch (e) {
    Router.replace(URLMap.login.href, URLMap.login.as);
  }
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
      Router.replace(URLMap.login.href, URLMap.login.as);
    }
  }
}

export default function* accountRootSaga() {
  yield all([accountTracker(), takeEvery(LOAD_USER_INFO, loadUserInfo)]);
}

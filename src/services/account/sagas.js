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

  if (pathname === URLMap.login.href) {
    Router.replace(URLMap.main.href, URLMap.main.as);
    return;
  }

  const { href, as } = toURLMap(pathname);
  const query = parse(_location.search, { charset: 'utf-8', ignoreQueryPrefix: true });
  const linkProps = makeLinkProps(href, as, query);
  Router.replace(linkProps.href, linkProps.as);
}

function* loadUserInfo() {
  let userInfo;
  try {
    userInfo = yield call(fetchUserInfo);
  } catch (e) {
    if (Window.get(LOCATION).pathname !== URLMap.login.href) {
      Router.replace(URLMap.login.href, URLMap.login.as);
    }
    return;
  }

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
      if (Window.get(LOCATION).pathname !== URLMap.login.href) {
        Router.replace(URLMap.login.href, URLMap.login.as);
      }
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

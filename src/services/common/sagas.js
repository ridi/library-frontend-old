import Router from 'next/router';
import { parse } from 'qs';

import { all, take, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { LOAD_ACTUAL_PAGE } from './actions';
import { requestGetBookIdsByUnitIds, requestGetBookIdsByUnitIdsForHidden } from './requests';

import { toURLMap, URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import { loadUserInfo } from '../account/sagas';

const _reduceSelectedBookIds = (items, selectedBookIds) =>
  selectedBookIds.reduce(
    (previous, bookId) => {
      const item = items[bookId];
      if (item.unit_count === 1) {
        previous.bookIds.push(item.b_id);
      } else {
        previous.unitIds.push(item.unit_id);
      }
      return previous;
    },
    { bookIds: [], unitIds: [] },
  );

const _flattenBookIds = bookIdsInUnitData =>
  Object.keys(bookIdsInUnitData).reduce((previous, key) => {
    const _bookIds = bookIdsInUnitData[key];
    return [...previous, ..._bookIds];
  }, []);

export function* getBookIdsByUnitIds(unitIds, orderType, orderBy) {
  const bookIdsInUnitData = yield call(requestGetBookIdsByUnitIds, orderType, orderBy, unitIds);
  return _flattenBookIds(bookIdsInUnitData);
}

export function* getBookIdsByItems(items, selectedBookIds, orderType, orderBy) {
  const { bookIds, unitIds } = _reduceSelectedBookIds(items, selectedBookIds);
  const bookIdsInUnit = yield call(getBookIdsByUnitIds, unitIds, orderType, orderBy);

  return [...bookIds, ...bookIdsInUnit];
}

export function* getBookIdsByUnitIdsForHidden(items, selectedBookIds) {
  const { bookIds, unitIds } = _reduceSelectedBookIds(items, selectedBookIds);
  const bookIdsInUnitData = yield call(requestGetBookIdsByUnitIdsForHidden, unitIds);
  const bookIdsInUnit = _flattenBookIds(bookIdsInUnitData);

  return [...bookIds, ...bookIdsInUnit];
}

function* loadActualPage() {
  yield take(LOAD_ACTUAL_PAGE);

  // Step 1. 접속한 URL의 현재 페이지 정보를 생성한다.
  const { href, as } = toURLMap(window.location.pathname);
  const query = parse(window.location.search, { charset: 'utf-8', ignoreQueryPrefix: true });
  const currentlinkProps = makeLinkProps(href, as, query);

  // Step 2. 로그인 페이지의 경우 로그인 API를 통해 로그인 여부를 판단할 때까지 시간이 걸려서 미리 로드해준다.
  if (currentlinkProps.href.pathname === URLMap.login.href) {
    yield delay(1);
    Router.replace(URLMap.index.href, URLMap.index.as);
  }

  try {
    // Step 3. 로그인 정보를 가져오는 메소드를 호출한다.
    yield call(loadUserInfo);
  } catch (e) {
    // Step 4-1. 로그인 안되어 있는데 로그인 페이지가 아니라면 로그인으로 이동한다.
    // fetchUserInfo 를 요청하기 때문에 middleware 에서 로그인 페이지로 이동한다,
    // 여기서 다시 페이지 이동을 호출하면 화면이 깜박거린다.
    // 로그인 페이지라면 위에서 먼저 렌더를 했기 떄문에 나머지 처리는 하지 않아도 된다.
    return;
  }

  // Step 4-2. 로그인 되어 있는데 로그인 페이지에 있다면 모든 책으로 이동한다.
  if (currentlinkProps.href.pathname === URLMap.login.href) {
    Router.replace(URLMap.index.href, URLMap.main.as);
    return;
  }

  // Step 5. 로그인이 되어있고, 로그인 페이지로 접근하는게 아닌 상태일때 원래 페이지를 로디안다.
  Router.replace(currentlinkProps.href, currentlinkProps.as);
}

export default function* commonRootSaga() {
  yield all([loadActualPage()]);
}

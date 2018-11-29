import { call, put, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { stringify } from 'qs';

import { convertUriToAndroidIntentUri } from '../../utils/uri';
import { getDeviceInfo } from '../../utils/device';
import Window, { LOCATION } from '../../utils/window';

import { showToast } from '../toast/actions';

import { requestGetBookIdsByUnitIds } from './requests';

function* _launchAppToDownload(isIos, isAndroid, isFirefox, appUri) {
  yield call(delay, 300);

  const Location = Window.get(LOCATION);
  if (isIos) {
    try {
      Location.href = appUri;
    } catch (e) {
      // TODO: Handle error.
    }
  } else if (isAndroid) {
    const androidUri = isFirefox ? appUri : convertUriToAndroidIntentUri(appUri, 'com.initialcoms.ridi');
    try {
      Location.href = androidUri;
    } catch (e) {
      Location.href = appUri;
    }
  } else {
    // $('#iframe_book_download').attr('src', appUri);
  }
}

function* _installApp(start, isIos, isAndroid) {
  // App이 Launch되면 Timer가 이벤트 루프에서 빠지지 않음.
  // App이 Launch될 시간을 주기 위해 1.5초 딜레이를 검
  yield call(delay, 1500);

  const Location = Window.get(LOCATION);

  // 2.5초 내에 타이머가 실행되면 앱이 다운되어 있지 않은 것으로 가정
  if (new Date() - start < 2500) {
    if (isIos) {
      Location.href = 'http://itunes.apple.com/kr/app/id338813698?mt=8';
    } else if (isAndroid) {
      Location.href = 'https://play.google.com/store/apps/details?id=com.initialcoms.ridi';
    } else {
      // $('#iframe_book_download').attr('src', '');
      // toast.show({
      //   text: '리디북스 뷰어 내 구매 목록에서 다운로드해주세요.',
      //   linkUrl: '/support/app',
      //   linkTitle: '이용 방법 보기',
      // }, 8000);
      yield put(showToast('리디북스 뷰어 내 구매 목록에서 다운로드해주세요.', 'https://ridibooks.com/support/app'));
    }
  }
}

export function* download(bookIds, url) {
  const appUri = `${url}&payload=${stringify({ b_ids: bookIds })}`;
  const { isIos, isAndroid, isFirefox } = getDeviceInfo();
  const start = new Date();

  const installTimer = yield fork(_installApp, start, isIos, isAndroid);
  yield call(_launchAppToDownload, isIos, isAndroid, isFirefox, appUri);
  yield cancel(installTimer);
}

const _reduceSelectedBookIds = (items, selectedBookIds) => {
  const reduced = selectedBookIds.reduce(
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

  return reduced;
};

const _flattenBookIds = bookIdsInUnitData =>
  Object.keys(bookIdsInUnitData).reduce((previous, key) => {
    const _bookIds = bookIdsInUnitData[key];
    return [...previous, ..._bookIds];
  }, []);

export function* getBookIdsByUnitIds(items, selectedBookIds, orderType, orderBy) {
  const { bookIds, unitIds } = _reduceSelectedBookIds(items, selectedBookIds);
  const bookIdsInUnitData = yield call(requestGetBookIdsByUnitIds, orderType, orderBy, unitIds);
  const bookIdsInUnit = _flattenBookIds(bookIdsInUnitData);

  return [...bookIds, ...bookIdsInUnit];
}

import { call, put, all, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { OrderBy, OrderType } from '../../constants/orderOptions';

import { convertUriToAndroidIntentUri } from '../../utils/uri';
import { getDeviceInfo } from '../../utils/device';
import Window, { LOCATION } from '../../utils/window';
import { getBookIdsByUnitIds } from '../common/sagas';

import { showToast } from '../toast/actions';
import { Duration, ToastStyle } from '../toast/constants';
import { DOWNLOAD_BOOKS, DOWNLOAD_BOOKS_BY_UNIT_IDS, setBookDownloadSrc } from './actions';

import { triggerDownload } from './requests';
import { DownloadError } from './errors';

function* _launchAppToDownload(isIos, isAndroid, isFirefox, appUri) {
  const Location = Window.get(LOCATION);
  if (isIos) {
    try {
      Location.href = appUri;
    } catch (e) {
      throw new DownloadError();
    }
  } else if (isAndroid) {
    const androidUri = isFirefox ? appUri : convertUriToAndroidIntentUri(appUri, 'com.initialcoms.ridi');
    try {
      Location.href = androidUri;
    } catch (e) {
      Location.href = appUri;
    }
  } else {
    yield put(setBookDownloadSrc(appUri));
  }
}

function* _installApp(start, isIos, isAndroid) {
  // App이 Launch되면 Timer가 이벤트 루프에서 빠지지 않음.
  // App이 Launch될 시간을 주기 위해 1.5초 딜레이를 검
  yield call(delay, 1500);
  const Location = Window.get(LOCATION);

  // 2.5초 이후에 온 거라면 정상 처리된 거임
  if (new Date() - start > 2500) {
    return;
  }

  if (isIos) {
    Location.href = 'http://itunes.apple.com/kr/app/id338813698?mt=8';
  } else if (isAndroid) {
    Location.href = 'https://play.google.com/store/apps/details?id=com.initialcoms.ridi';
  } else {
    yield put(setBookDownloadSrc(''));
    yield put(
      showToast(
        '리디북스 뷰어 내 구매 목록에서 다운로드해주세요.',
        '이용 방법 보기',
        null,
        'https://help.ridibooks.com/hc/ko/sections/115003069928',
        Duration.VERY_LONG,
        ToastStyle.BLUE,
      ),
    );
  }
}

export function* _download(bookIds, url) {
  const appUri = `${url}&payload=${encodeURIComponent(JSON.stringify({ b_ids: bookIds }))}`;
  const { isIos, isAndroid, isFirefox } = getDeviceInfo();
  const start = new Date();

  yield _launchAppToDownload(isIos, isAndroid, isFirefox, appUri);
  if (!isAndroid) {
    yield call(_installApp, start, isIos, isAndroid);
  }
}

export function* downloadBooks(bookIds) {
  const triggerResponse = yield call(triggerDownload, bookIds);

  if (triggerResponse.result) {
    yield call(_download, triggerResponse.b_ids, triggerResponse.url);
  } else {
    yield put(showToast(triggerResponse.message));
  }
}

export function* downloadBooksByUnitIds(unitIds) {
  // 해당 유닛의 전체 데이터 받아야 하기 때문에 기본 값으로 unit 을 조회한다.
  const bookIds = yield call(getBookIdsByUnitIds, unitIds, OrderType.PURCHASE_DATE, OrderBy.DESC);
  yield call(downloadBooks, bookIds);
}

export function* downloadBookActionAdaptor(action) {
  yield call(downloadBooks, action.payload.bookIds);
}

export function* downloadBooksByUnitIdsActionAdaptor(action) {
  yield call(downloadBooksByUnitIds, action.payload.unitIds);
}

export default function* commonRootSaga() {
  yield all([takeEvery(DOWNLOAD_BOOKS, downloadBookActionAdaptor)]);
  yield all([takeEvery(DOWNLOAD_BOOKS_BY_UNIT_IDS, downloadBooksByUnitIdsActionAdaptor)]);
}

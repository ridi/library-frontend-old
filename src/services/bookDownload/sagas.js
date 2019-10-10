import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects';

import { OrderBy, OrderType } from '../../constants/orderOptions';
import { getDeviceInfo } from '../../utils/device';
import { convertUriToAndroidIntentUri } from '../../utils/uri';

import { fetchBookData } from '../book/requests';
import { getBookIdsByUnitIds } from '../common/sagas';
import * as selectionSelectors from '../selection/selectors';
import { showToast } from '../toast/actions';
import { Duration, ToastStyle } from '../toast/constants';

import { DOWNLOAD_BOOKS, DOWNLOAD_BOOKS_BY_UNIT_IDS, DOWNLOAD_SELECTED_BOOKS, setBookDownloadSrc } from './actions';
import { DownloadError } from './errors';
import { triggerDownload } from './requests';

function* _launchAppToDownload(isIos, isAndroid, isFirefox, bookIds, url) {
  const appUri = `${url}&payload=${encodeURIComponent(JSON.stringify({ b_ids: bookIds }))}`;
  if (isIos) {
    try {
      window.location.href = appUri;
    } catch (e) {
      throw new DownloadError();
    }
  } else if (isAndroid) {
    const androidUri = isFirefox ? appUri : convertUriToAndroidIntentUri(appUri, 'com.initialcoms.ridi');
    try {
      window.location.href = androidUri;
    } catch (e) {
      window.location.href = appUri;
    }
  } else {
    const books = yield call(fetchBookData, bookIds);
    const bookIdsWithoutWebtoon = books.filter(book => !book.file?.is_webtoon).map(book => book.id);
    const pcUri = `${url}&payload=${encodeURIComponent(JSON.stringify({ b_ids: bookIdsWithoutWebtoon }))}`;
    if (bookIds.length !== bookIdsWithoutWebtoon.length) {
      if (bookIdsWithoutWebtoon.length === 0) {
        yield put(
          showToast({
            message: '정책상의 이유로 웹툰은 PC뷰어에서 이용할 수 없습니다.',
            toastStyle: ToastStyle.BLUE,
          }),
        );
        return false;
      }
      yield put(
        showToast({
          message: '정책상의 이유로 웹툰은 제외하고 다운로드합니다.',
          toastStyle: ToastStyle.BLUE,
        }),
      );
      yield delay(1000);
    }
    yield put(setBookDownloadSrc(pcUri));
  }
  return true;
}

function* _showViewerGuildLink(isIos, isAndroid) {
  yield put(setBookDownloadSrc(''));

  const message = isIos || isAndroid ? '리디북스 뷰어에서 책을 이용하실 수 있습니다.' : '리디북스 뷰어 내 구매 목록에서 다운로드해주세요.';
  // eslint-disable-next-line no-nested-ternary
  const linkName = isIos ? '앱스토어로 가기' : isAndroid ? '플레이스토어로 가기' : '이용 방법 보기';

  const helpLink = 'https://help.ridibooks.com/hc/ko/sections/115003069928';
  const appStoreLink = 'http://itunes.apple.com/kr/app/id338813698?mt=8';
  const playStoreLink = 'https://play.google.com/store/apps/details?id=com.initialcoms.ridi';
  // eslint-disable-next-line no-nested-ternary
  const link = isIos ? appStoreLink : isAndroid ? playStoreLink : helpLink;

  yield put(
    showToast({
      message,
      linkName,
      outLink: link,
      duration: Duration.VERY_LONG,
      toastStyle: ToastStyle.BLUE,
    }),
  );
}

export function* _download(bookIds, url) {
  const { isIos, isAndroid, isFirefox } = getDeviceInfo();
  const isSuccessful = yield _launchAppToDownload(isIos, isAndroid, isFirefox, bookIds, url);
  if (!isSuccessful) {
    return;
  }

  // 안드로이드에서는 convertUriToAndroidIntentUri 를 통해서 자동으로 플레이스토어를 띄워준다.
  // 그러나 안드로이드 파이어폭스 브라우저는 그런 기능이 없기 때문에 뷰어 오픈이 성공 했어도 뷰어 가이드를 보여준다.
  if (!isAndroid || isFirefox) {
    yield delay(1000);
    yield call(_showViewerGuildLink, isIos, isAndroid);
  }
}

export function* downloadBooks(bookIds) {
  const triggerResponse = yield call(triggerDownload, bookIds);
  const { result: responseResult, b_ids: downloadableBookIds, url: downloadUrl } = triggerResponse;
  if (responseResult) {
    yield call(_download, downloadableBookIds, downloadUrl);
  } else {
    yield put(showToast({ message: '다운로드할 수 있는 책이 없습니다.' }));
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

function* downloadSelectedBooksActionAdaptor() {
  const bookIds = yield select(selectionSelectors.getSelectedItemIds);
  yield call(downloadBooks, bookIds);
}

export function* downloadBooksByUnitIdsActionAdaptor(action) {
  yield call(downloadBooksByUnitIds, action.payload.unitIds);
}

export default function* commonRootSaga() {
  yield all([
    takeEvery(DOWNLOAD_BOOKS, downloadBookActionAdaptor),
    takeEvery(DOWNLOAD_SELECTED_BOOKS, downloadSelectedBooksActionAdaptor),
    takeEvery(DOWNLOAD_BOOKS_BY_UNIT_IDS, downloadBooksByUnitIdsActionAdaptor),
  ]);
}

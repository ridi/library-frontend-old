import { all } from 'redux-saga/effects';
import accountRootSaga from 'services/account/sagas';
import bookRootSaga from 'services/book/sagas';
import bookDownloadRootSaga from 'services/bookDownload/sagas';
import excelDownloadRootSaga from 'services/excelDownload/sagas';
// import featureRootSaga from 'services/feature/sagas';
import purchasedCommonRootSaga from 'services/purchased/common/sagas/rootSagas';
import filterRootSaga from 'services/purchased/filter/sagas';
import purchasedHiddenSaga from 'services/purchased/hidden/sagas';
import purchasedMainRootSaga from 'services/purchased/main/sagas';
import serialPreferenceRootSaga from 'services/serialPreference/sagas';
import shelfRootSaga from 'services/shelf/sagas';
import toastRootSaga from 'services/toast/sagas';
import trackingRootSaga from 'services/tracking/sagas';
import uiRootSaga from 'services/ui/sagas';
import unitPageRootSaga from 'services/unitPage/sagas';

export default function* rootSaga() {
  yield all([
    accountRootSaga(),
    bookRootSaga(),
    excelDownloadRootSaga(),
    // featureRootSaga(),
    filterRootSaga(),
    purchasedCommonRootSaga(),
    purchasedMainRootSaga(),
    purchasedHiddenSaga(),
    serialPreferenceRootSaga(),
    uiRootSaga(),
    unitPageRootSaga(),
    shelfRootSaga(),
    toastRootSaga(),
    trackingRootSaga(),
    bookDownloadRootSaga(),
  ]);
}

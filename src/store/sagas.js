import { all, call, put } from 'redux-saga/effects';
import accountRootSaga, { loadUserInfo } from '../services/account/sagas';
import bookRootSaga from '../services/book/sagas';
import bookDownloadRootSaga from '../services/bookDownload/sagas';
import excelDownloadRootSaga from '../services/excelDownload/sagas';
import featureRootSaga from '../services/feature/sagas';
import purchasedCommonRootSaga from '../services/purchased/common/sagas/rootSagas';
import purchasedHiddenSaga from '../services/purchased/hidden/sagas';
import purchasedMainRootSaga from '../services/purchased/main/sagas';
import purchasedSearchRootSaga from '../services/purchased/search/sagas';
import serialPreferenceRootSaga from '../services/serialPreference/sagas';
import uiRootSaga from '../services/ui/sagas';
import unitPageRootSaga from '../services/unitPage/sagas';
import shelfRootSaga from '../services/shelf/sagas';
import toastRootSaga from '../services/toast/sagas';
import trackingRootSaga from '../services/tracking/sagas';

import { startAccountTracker } from '../services/account/actions';
import { setMaintenance } from '../services/maintenance/actions';
import { getMaintenanceStatus } from '../services/maintenance/requests';

function* getMaintenanceStatusSaga() {
  try {
    const [maintenanceStatus, userInfo] = yield all([call(getMaintenanceStatus), call(loadUserInfo)]);
    yield put(setMaintenance(maintenanceStatus));
    if (!maintenanceStatus.isShow && userInfo != null) {
      yield put(startAccountTracker());
    }
  } catch (e) {
    //
  }
}

export default function* rootSaga() {
  yield all([
    accountRootSaga(),
    bookRootSaga(),
    excelDownloadRootSaga(),
    featureRootSaga(),
    purchasedCommonRootSaga(),
    purchasedMainRootSaga(),
    purchasedSearchRootSaga(),
    purchasedHiddenSaga(),
    serialPreferenceRootSaga(),
    uiRootSaga(),
    unitPageRootSaga(),
    shelfRootSaga(),
    toastRootSaga(),
    trackingRootSaga(),
    bookDownloadRootSaga(),
    getMaintenanceStatusSaga(),
  ]);
}

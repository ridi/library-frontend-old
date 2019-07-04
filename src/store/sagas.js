import { all, call, put } from 'redux-saga/effects';
import accountRootSaga, { loadUserInfo } from '../services/account/sagas';
import bookRootSaga from '../services/book/sagas';
import bookDownloadRootSaga from '../services/bookDownload/sagas';
import excelDownloadRootSaga from '../services/excelDownload/sagas';
import featureRootSaga from '../services/feature/sagas';
import purchasedCommonRootSaga from '../services/purchased/common/sagas/rootSagas';
// import purchasedHiddenSaga from '../services/purchased/hidden/sagas';
// import purchaseHiddenUnitRootSaga from '../services/purchased/hiddenUnit/sagas';
import purchasedMainRootSaga from '../services/purchased/main/sagas';
// import purchasedMainUnitRootSaga from '../services/purchased/mainUnit/sagas';
// import purchasedSearchRootSaga from '../services/purchased/search/sagas';
// import purchasedSearchUnitRootSaga from '../services/purchased/searchUnit/sagas';
// import serialPreferenceRootSaga from '../services/serialPreference/sagas';
import shelfRootSaga from '../services/shelf/sagas';
import toastRootSaga from '../services/toast/sagas';
import trackingRootSaga from '../services/tracking/sagas';

import { startAccountTracker } from '../services/account/actions';
import { setMaintenance } from '../services/maintenance/actions';
import { getMaintenanceStatus } from '../services/maintenance/requests';

function* getMaintenanceStatusSaga() {
  try {
    const [maintenanceStatus] = yield all([call(getMaintenanceStatus), call(loadUserInfo)]);
    yield put(setMaintenance(maintenanceStatus));
    if (!maintenanceStatus.isShow) {
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
    // purchasedMainUnitRootSaga(),
    // purchasedSearchRootSaga(),
    // purchasedSearchUnitRootSaga(),
    // purchasedHiddenSaga(),
    // purchaseHiddenUnitRootSaga(),
    // serialPreferenceRootSaga(),
    shelfRootSaga(),
    toastRootSaga(),
    trackingRootSaga(),
    bookDownloadRootSaga(),
    getMaintenanceStatusSaga(),
  ]);
}

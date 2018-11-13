import { all } from 'redux-saga/effects';

import accountRootSaga from '../services/account/sagas';
import bookRootSaga from '../services/book/sagas';
import purchaseRootSaga from '../services/purchase/sagas';
import searchRootSaga from '../services/search/sagas';
import purchasedHiddenSaga from '../services/purchased/hidden/sagas';
import purchasedUnitSaga from '../services/purchased/mainUnit/sagas';

export default function* rootSaga() {
  yield all([accountRootSaga(), bookRootSaga(), purchaseRootSaga(), searchRootSaga(), purchasedHiddenSaga(), purchasedUnitSaga()]);
}

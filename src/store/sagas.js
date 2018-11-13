import { all } from 'redux-saga/effects';

import accountRootSaga from '../services/account/sagas';
import bookRootSaga from '../services/book/sagas';
import purchaseMainRootSaga from '../services/purchased/main/sagas';
import searchRootSaga from '../services/purchased/search/sagas';
import purchasedHiddenSaga from '../services/purchased/hidden/sagas';
import purchasedUnitSaga from '../services/purchased/mainUnit/sagas';

export default function* rootSaga() {
  yield all([accountRootSaga(), bookRootSaga(), purchaseMainRootSaga(), searchRootSaga(), purchasedHiddenSaga(), purchasedUnitSaga()]);
}

import { all } from 'redux-saga/effects';

import showsRootSaga from '../services/shows/sagas';
import accountRootSaga from '../services/account/sagas';
import bookRootSaga from '../services/book/sagas';
import purchaseRootSaga from '../services/purchase/sagas';
import searchRootSaga from '../services/search/sagas';

export default function* rootSaga() {
  yield all([
    showsRootSaga(),
    accountRootSaga(),
    bookRootSaga(),
    purchaseRootSaga(),
    searchRootSaga(),
  ]);
}


import { all } from 'redux-saga/effects';

import showsRootSaga from '../services/shows/sagas';
import accountRootSaga from '../services/account/sagas';

export default function* rootSaga() {
  yield all([
    showsRootSaga(),
    accountRootSaga(),
  ]);
}
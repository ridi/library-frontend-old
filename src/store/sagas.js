
import { all } from 'redux-saga/effects';

import showsRootSaga from '../services/shows/sagas';

export default function* rootSaga() {
  yield all([
    showsRootSaga(),
  ]);
}
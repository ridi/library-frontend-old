import { all, takeEvery, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { SHOW_TOAST, setToast, unsetToast } from './actions';

function* closeToast() {
  yield put(unsetToast());
}

function* showToast(action) {
  yield call(closeToast);

  const { duration, message, uri } = action.payload;
  yield put(setToast(message, uri));
  yield call(delay, duration);
  yield call(closeToast());
}

export default function* toastRootSaga() {
  yield all([takeEvery(SHOW_TOAST, showToast)]);
}

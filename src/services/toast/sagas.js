import { all, call, delay, put, race, take, takeEvery } from 'redux-saga/effects';

import { CANCEL_CLOSE, cancelClose, CLOSE_TOAST, CLOSE_WITH_DELAY, setToast, SHOW_TOAST, unsetToast } from './actions';

function* closeToast() {
  yield put(unsetToast());
}

function* _delayClose(duration) {
  const { cancel } = yield race({
    cancel: take(CANCEL_CLOSE),
    timeout: delay(duration),
  });

  if (cancel) {
    return;
  }

  yield call(closeToast);
}

function* showToast(action) {
  yield put(cancelClose());
  yield call(closeToast);

  const { duration } = action.payload;
  yield put(setToast({ ...action.payload }));
  yield call(_delayClose, duration);
}

function* closeWithDelay(action) {
  yield call(_delayClose, action.payload.duration);
}

export default function* toastRootSaga() {
  yield all([takeEvery(SHOW_TOAST, showToast), takeEvery(CLOSE_TOAST, closeToast), takeEvery(CLOSE_WITH_DELAY, closeWithDelay)]);
}

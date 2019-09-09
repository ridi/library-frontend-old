import { all, delay, takeEvery, call, put, take, race } from 'redux-saga/effects';

import { SHOW_TOAST, CLOSE_TOAST, CLOSE_WITH_DELAY, CANCEL_CLOSE, setToast, unsetToast, cancelClose } from './actions';

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

import { all, takeEvery, call, put, take, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { SHOW_TOAST, CLOSE_TOAST, CLOSE_WITH_DELAY, CANCEL_CLOSE, setToast, unsetToast, cancelClose } from './actions';

function* closeToast() {
  yield put(unsetToast());
}

function* _delayClose(duration) {
  const { cancel } = yield race({
    cancel: take(CANCEL_CLOSE),
    timeout: call(delay, duration),
  });

  if (cancel) {
    return;
  }

  yield call(closeToast);
}

function* showToast(action) {
  yield put(cancelClose());
  yield call(closeToast);

  const { duration, message, uri } = action.payload;
  yield put(setToast(message, uri, duration));
  yield call(_delayClose, duration);
}

function* closeWithDelay(action) {
  yield call(_delayClose, action.payload.duration);
}

export default function* toastRootSaga() {
  yield all([takeEvery(SHOW_TOAST, showToast), takeEvery(CLOSE_TOAST, closeToast), takeEvery(CLOSE_WITH_DELAY, closeWithDelay)]);
}

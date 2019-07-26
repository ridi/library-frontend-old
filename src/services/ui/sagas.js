import { put, takeEvery } from 'redux-saga/effects';

import settings from '../../utils/settings';
import * as uiActions from './actions';

function* saveViewType(action) {
  settings.viewType = action.payload.viewType;
}

export default function* uiRootSaga() {
  // FIXME: SSR 적용 시 서버 렌더 결과와 일치하도록 잘 처리해야 함
  if (settings.viewType) {
    yield put(uiActions.setViewType(settings.viewType));
  }
  yield takeEvery(uiActions.SET_VIEW_TYPE, saveViewType);
}

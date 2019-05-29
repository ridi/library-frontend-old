import { call, put, takeEvery } from 'redux-saga/effects';
import * as featureIds from '../../constants/featureIds';
import * as actions from './actions';
import * as requests from './requests';

function* checkFeature(id) {
  try {
    const result = yield call(requests.fetchIsFeatureEnabled, id);
    yield put(actions.setFeature(id, result));
  } catch (_) {
    yield put(actions.setFeature(id, false));
  }
}

function* checkAllFeatures() {
  yield call(checkFeature, featureIds.SYNC_SHELF);
}

export default function* featureRootSaga() {
  yield takeEvery(actions.CHECK_ALL_FEATURES, checkAllFeatures);
}

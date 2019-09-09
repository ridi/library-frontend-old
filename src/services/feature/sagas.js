import { call, put } from 'redux-saga/effects';
import * as featureIds from '../../constants/featureIds';
import * as actions from './actions';
import * as requests from './requests';

function* checkFeature(featureId) {
  try {
    const result = yield call(requests.fetchIsFeatureEnabled, featureId);
    yield put(actions.setFeature(featureId, result));
  } catch (_) {
    yield put(actions.setFeature(featureId, false));
  }
}

function* checkAllFeatures() {
  yield call(checkFeature, featureIds.SYNC_SHELF);
}

export default function* featureRootSaga() {
  yield call(checkAllFeatures);
}

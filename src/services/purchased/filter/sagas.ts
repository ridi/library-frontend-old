import { call, put, takeLatest } from 'redux-saga/effects';

import * as actions from './actions';
import * as requests from './requests';

export function* updateCategories() {
  const categories = yield call(requests.fetchPurchaseCategories);
  yield put(actions.setFilterOptions(categories));
}

export default function* filterRootSaga() {
  yield takeLatest(actions.UPDATE_CATEGORIES, updateCategories);
}

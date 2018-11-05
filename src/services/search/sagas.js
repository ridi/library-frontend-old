import { all, call, select, takeEvery } from 'redux-saga/effects';

import { getQuery } from '../router/selectors';
import { LOAD_SEARCH_PAGE } from './actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);

  console.log(query);
}

function* loadSearchPage() {
  yield call(persistPageOptionsFromQueries);
}

export default function* searchRootSaga() {
  yield all([takeEvery(LOAD_SEARCH_PAGE, loadSearchPage)]);
}

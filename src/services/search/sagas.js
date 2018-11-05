import { all, call, select, put, takeEvery } from 'redux-saga/effects';

import { getQuery } from '../router/selectors';
import { LOAD_SEARCH_PAGE, setSearchPage, setSearchKeyword } from './actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  const keyword = query.keyword || '';

  yield all([put(setSearchPage(page)), put(setSearchKeyword(keyword))]);
}

function* loadSearchPage() {
  yield call(persistPageOptionsFromQueries);
}

export default function* searchRootSaga() {
  yield all([takeEvery(LOAD_SEARCH_PAGE, loadSearchPage)]);
}

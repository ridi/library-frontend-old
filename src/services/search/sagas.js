import { all, call, select, put, takeEvery } from 'redux-saga/effects';

import { getQuery } from '../router/selectors';
import { loadBookData } from '../book/sagas';
import { toFlatten } from '../../utils/array';

import {
  LOAD_SEARCH_PAGE,
  setSearchPage,
  setSearchKeyword,
  setSearchTotalCount,
  setSearchItems,
} from './actions';
import { getSearchOptions } from './selectors';
import { fetchSearchItems, fetchSearchItemsTotalCount } from './requests';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  const keyword = query.keyword || '';

  yield all([put(setSearchPage(page)), put(setSearchKeyword(keyword))]);
}

function* loadSearchPage() {
  yield call(persistPageOptionsFromQueries);

  const { page, keyword } = yield select(getSearchOptions);
  const [itemResponse, countResponse] = yield all([
    call(fetchSearchItems, keyword, page),
    call(fetchSearchItemsTotalCount, keyword),
  ]);

  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([
    put(setSearchItems(itemResponse.items)),
    put(
      setSearchTotalCount(
        countResponse.unit_total_count,
        countResponse.item_total_count,
      ),
    ),
  ]);
}

export default function* searchRootSaga() {
  yield all([takeEvery(LOAD_SEARCH_PAGE, loadSearchPage)]);
}

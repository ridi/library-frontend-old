import Router from 'next/router';
import { all, call, select, put, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { getQuery } from '../../router/selectors';
import { toFlatten } from '../../../utils/array';
import { makeURI } from '../../../utils/uri';

import {
  LOAD_SEARCH_PAGE,
  CHANGE_SEARCH_KEYWORD,
  HIDE_SELECTED_SEARCH_BOOKS,
  setSearchPage,
  setSearchKeyword,
  setSearchTotalCount,
  setSearchItems,
  DOWNLOAD_SELECTED_SEARCH_BOOKS,
} from './actions';
import { showToast } from '../../toast/actions';
import { getSearchOptions, getSelectedSearchBooks, getSearchItems } from './selectors';

import { fetchSearchItems, fetchSearchItemsTotalCount } from './requests';
import { getRevision, triggerDownload, requestHide } from '../../common/requests';
import { download, getBookIdsByUnitIds } from '../../common/sagas';
import { loadBookData } from '../../book/sagas';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  const keyword = query.keyword || '';

  yield all([put(setSearchPage(page)), put(setSearchKeyword(keyword))]);
}

function* loadSearchPage() {
  yield call(persistPageOptionsFromQueries);

  const { page, keyword } = yield select(getSearchOptions);
  const [itemResponse, countResponse] = yield all([call(fetchSearchItems, keyword, page), call(fetchSearchItemsTotalCount, keyword)]);

  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([
    put(setSearchItems(itemResponse.items)),
    put(setSearchTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
  ]);
}

function changeSearchKeyword(action) {
  const query = {
    page: 1,
    keyword: action.payload.keyword,
  };

  Router.push(makeURI('/purchased/search', query));
}

function* hideSelectedSearchBooks() {
  const items = yield select(getSearchItems);
  const selectedBooks = yield select(getSelectedSearchBooks);

  const bookIds = yield call(getBookIdsByUnitIds, items, Object.keys(selectedBooks));

  const revision = yield call(getRevision);
  const queueIds = yield call(requestHide, bookIds, revision);

  // TODO: Check Queue Status
  yield call(delay, 3000); // Temporary Sleep

  yield call(loadSearchPage);
}

function* downloadSelectedSearchBooks() {
  const items = yield select(getSearchItems);
  const selectedBooks = yield select(getSelectedSearchBooks);

  const bookIds = yield call(getBookIdsByUnitIds, items, Object.keys(selectedBooks));

  const triggerResponse = yield call(triggerDownload, bookIds);
  if (triggerResponse.result) {
    yield call(download, triggerResponse.b_ids, triggerResponse.url);
  } else {
    yield put(showToast(triggerResponse.message));
  }
}

export default function* searchRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_PAGE, loadSearchPage),
    takeEvery(CHANGE_SEARCH_KEYWORD, changeSearchKeyword),
    takeEvery(HIDE_SELECTED_SEARCH_BOOKS, hideSelectedSearchBooks),
    takeEvery(DOWNLOAD_SELECTED_SEARCH_BOOKS, downloadSelectedSearchBooks),
  ]);
}

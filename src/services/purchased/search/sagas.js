import Router from 'next/router';
import { all, call, select, put, takeEvery } from 'redux-saga/effects';

import { getQuery } from '../../router/selectors';
import { toFlatten } from '../../../utils/array';
import { makeURI } from '../../../utils/uri';

import {
  LOAD_SEARCH_ITEMS,
  CHANGE_SEARCH_KEYWORD,
  HIDE_SELECTED_SEARCH_BOOKS,
  DOWNLOAD_SELECTED_SEARCH_BOOKS,
  SELECT_ALL_SEARCH_BOOKS,
  setPage,
  setSearchKeyword,
  setTotalCount,
  setItems,
  setSelectBooks,
  setSearchFetchingBooks,
} from './actions';
import { showToast } from '../../toast/actions';
import { getItemsByPage, getOptions, getSelectedBooks, getItems } from './selectors';

import { fetchSearchItems, fetchSearchItemsTotalCount } from './requests';
import { getRevision, triggerDownload, requestHide, requestCheckQueueStatus } from '../../common/requests';
import { download, getBookIdsByUnitIds } from '../../common/sagas';
import { loadBookData } from '../../book/sagas';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  const keyword = query.keyword || '';

  yield all([put(setPage(page)), put(setSearchKeyword(keyword))]);
}

function* loadPage() {
  yield call(persistPageOptionsFromQueries);

  const { page, keyword } = yield select(getOptions);

  yield put(setSearchFetchingBooks(true));
  const [itemResponse, countResponse] = yield all([call(fetchSearchItems, keyword, page), call(fetchSearchItemsTotalCount, keyword)]);

  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count))]);
  yield put(setSearchFetchingBooks(false));
}

function changeSearchKeyword(action) {
  const query = {
    page: 1,
    keyword: action.payload.keyword,
  };

  Router.push(makeURI('/purchased/search', query));
}

function* hideSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIds, items, Object.keys(selectedBooks));
  const queueIds = yield call(requestHide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
  yield call(loadPage);
}

function* downloadSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const bookIds = yield call(getBookIdsByUnitIds, items, Object.keys(selectedBooks));

  const triggerResponse = yield call(triggerDownload, bookIds);
  if (triggerResponse.result) {
    yield call(download, triggerResponse.b_ids, triggerResponse.url);
  } else {
    yield put(showToast(triggerResponse.message));
  }
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(setSelectBooks(bookIds));
}

export default function* purcahsedSearchRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_ITEMS, loadPage),
    takeEvery(CHANGE_SEARCH_KEYWORD, changeSearchKeyword),
    takeEvery(HIDE_SELECTED_SEARCH_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_SEARCH_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_SEARCH_BOOKS, selectAllBooks),
  ]);
}

import Router from 'next/router';
import { all, call, select, put, takeEvery } from 'redux-saga/effects';

import { getQuery } from '../../router/selectors';
import { loadBookData } from '../../book/sagas';
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
} from './actions';
import { getSearchOptions, getSelectedSearchBooks } from './selectors';
import { fetchSearchItems, fetchSearchItemsTotalCount, requestHide } from './requests';

import { getRevision } from '../../common/requests';

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
  const selectedBooks = yield select(getSelectedSearchBooks);
  const selectedBookIds = Object.keys(selectedBooks);

  // TODO: Get Book Ids

  const revision = yield call(getRevision);
  const queueIds = yield call(requestHide, selectedBookIds, revision);

  // TODO: Check Queue Status

  yield call(loadSearchPage);
}

function* downloadSelectedSearchBooks() {
  console.log('downloadSelectedBooks');
}

export default function* searchRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_PAGE, loadSearchPage),
    takeEvery(CHANGE_SEARCH_KEYWORD, changeSearchKeyword),
    takeEvery(HIDE_SELECTED_SEARCH_BOOKS, hideSelectedSearchBooks),
  ]);
}

import Router from 'next/router';
import { all, call, select, put, takeEvery } from 'redux-saga/effects';

import { getQuery } from '../../router/selectors';
import { toFlatten } from '../../../utils/array';
import { makeURI, makeLinkProps } from '../../../utils/uri';

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
  setSearchIsFetchingBooks,
} from './actions';
import { showToast } from '../../toast/actions';
import { getItemsByPage, getOptions, getSelectedBooks, getItems } from './selectors';

import { fetchSearchItems, fetchSearchItemsTotalCount } from './requests';
import { getRevision, requestHide, requestCheckQueueStatus } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { loadBookData, extractUnitData } from '../../book/sagas';
import { setFullScreenLoading, setError } from '../../ui/actions';
import { URLMap } from '../../../constants/urls';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  const keyword = query.keyword || '';

  yield all([put(setPage(page)), put(setSearchKeyword(keyword))]);
}

function* loadPage() {
  yield put(setError(false));
  yield call(persistPageOptionsFromQueries);

  const { page, keyword } = yield select(getOptions);

  if (!keyword) {
    return;
  }
  try {
    yield put(setSearchIsFetchingBooks(true));

    const [itemResponse, countResponse] = yield all([call(fetchSearchItems, keyword, page), call(fetchSearchItemsTotalCount, keyword)]);

    yield call(extractUnitData, itemResponse.items);

    const bookIds = toFlatten(itemResponse.items, 'b_id');
    yield call(loadBookData, bookIds);
    yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count))]);
    yield put(setSearchIsFetchingBooks(false));
  } catch (err) {
    yield all([put(setError(true)), put(setSearchIsFetchingBooks(false))]);
  }
}

function changeSearchKeyword(action) {
  const query = {
    page: 1,
    keyword: action.payload.keyword,
  };

  Router.push(makeURI('/purchased/search', query));
}

function* hideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks));
  const queueIds = yield call(requestHide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadPage);
  }

  yield all([
    put(
      showToast(
        isFinish ? '내 서재에서 숨겼습니다.' : '내 서재에서 숨겼습니다. 잠시후 반영 됩니다.',
        '숨긴 도서 목록 보기',
        makeLinkProps(URLMap.hidden.href, URLMap.hidden.as),
      ),
    ),
    put(setFullScreenLoading(false)),
  ]);
}

function* downloadSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks));

  yield call(downloadBooks, bookIds);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(setSelectBooks(bookIds));
}

export default function* purchasedSearchRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_ITEMS, loadPage),
    takeEvery(CHANGE_SEARCH_KEYWORD, changeSearchKeyword),
    takeEvery(HIDE_SELECTED_SEARCH_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_SEARCH_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_SEARCH_BOOKS, selectAllBooks),
  ]);
}

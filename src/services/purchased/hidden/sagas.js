import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_HIDDEN_ITEMS,
  SELECT_ALL_HIDDEN_BOOKS,
  UNHIDE_SELECTED_HIDDEN_BOOKS,
  DELETE_SELECTED_HIDDEN_BOOKS,
  setItems,
  setPage,
  setTotalCount,
  selectBooks,
  setHiddenIsFetchingBooks,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData, extractUnitData } from '../../book/sagas';
import { fetchHiddenItems, fetchHiddenItemsTotalCount } from './requests';
import { toFlatten } from '../../../utils/array';
import { getOptions, getItems, getItemsByPage, getSelectedBooks } from './selectors';

import { getRevision, requestUnhide, requestCheckQueueStatus, requestDelete } from '../../common/requests';
import { getBookIdsByUnitIdsForHidden } from '../../common/sagas';
import { showToast } from '../../toast/actions';
import { setFullScreenLoading } from '../../fullScreenLoading/actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPage(page));
}

function* loadItems() {
  yield call(persistPageOptionsFromQueries);

  const { page } = yield select(getOptions);

  yield put(setHiddenIsFetchingBooks(true));
  const [itemResponse, countResponse] = yield all([call(fetchHiddenItems, page), call(fetchHiddenItemsTotalCount)]);

  yield call(extractUnitData, itemResponse.items);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count))]);
  yield put(setHiddenIsFetchingBooks(false));
}

function* unhideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
  const queueIds = yield call(requestUnhide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadItems);
  }

  // TODO 메시지 수정
  yield all([put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.')), put(setFullScreenLoading(false))]);
}

function* deleteSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
  const queueIds = yield call(requestDelete, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadItems);
  }

  // TODO 메시지 수정
  yield all([put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.')), put(setFullScreenLoading(false))]);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(selectBooks(bookIds));
}

export default function* purchasedHiddenSaga() {
  yield all([
    takeEvery(LOAD_HIDDEN_ITEMS, loadItems),
    takeEvery(UNHIDE_SELECTED_HIDDEN_BOOKS, unhideSelectedBooks),
    takeEvery(DELETE_SELECTED_HIDDEN_BOOKS, deleteSelectedBooks),
    takeEvery(SELECT_ALL_HIDDEN_BOOKS, selectAllBooks),
  ]);
}

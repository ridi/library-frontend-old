import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
  LOAD_HIDDEN_ITEMS,
  SELECT_ALL_HIDDEN_BOOKS,
  SHOW_SELECTED_HIDDEN_BOOKS,
  DELETE_SELECTED_HIDDEN_BOOKS,
  setHiddenItems,
  setHiddenPage,
  setHiddenTotalCount,
  setSelectHiddenBooks,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData } from '../../book/sagas';
import { fetchHiddenItems, fetchHiddenItemsTotalCount } from './requests';
import { toFlatten } from '../../../utils/array';
import { getOptions, getItems, getItemsByPage, getSelectedBooks } from './selectors';

import { getRevision, requestShow, requestCheckQueueStatus } from '../../common/requests';
import { getBookIdsByUnitIdsForHidden } from '../../common/sagas';
import { showToast } from '../../toast/actions';

function* persistPageOptionsFromQuries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setHiddenPage(page));

  yield all([put(setHiddenPage(page))]);
}

function* loadHiddenItems() {
  yield call(persistPageOptionsFromQuries);

  const { page } = yield select(getOptions);

  const [itemResponse, countResponse] = yield all([call(fetchHiddenItems, page), call(fetchHiddenItemsTotalCount)]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);

  yield all([put(setHiddenItems(itemResponse.items)), put(setHiddenTotalCount(countResponse.item_total_count))]);
}

function* showSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
  const queueIds = yield call(requestShow, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
  yield call(loadHiddenItems);
}

function* deleteSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
  // TODO: CSRF Token 어떻게 할지 결정되어야 한다.
  console.log('삭제 되었따고 치고');

  yield call(delay, 3000); // Temporary Sleep

  yield call(loadHiddenItems);
}

function* selectAllHiddenBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(setSelectHiddenBooks(bookIds));
}

export default function* purchasedHiddenSaga() {
  yield all([
    takeEvery(LOAD_HIDDEN_ITEMS, loadHiddenItems),
    takeEvery(SHOW_SELECTED_HIDDEN_BOOKS, showSelectedBooks),
    takeEvery(DELETE_SELECTED_HIDDEN_BOOKS, deleteSelectedBooks),
    takeEvery(SELECT_ALL_HIDDEN_BOOKS, selectAllHiddenBooks),
  ]);
}

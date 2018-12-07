import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
  LOAD_PURCHASED_HIDDEN_ITEMS,
  SELECT_ALL_HIDDEN_BOOKS,
  SHOW_SELECTED_BOOKS,
  DELETE_SELECTED_BOOKS,
  setPurchasedHiddenItems,
  setPurchasedHiddenPage,
  setPurchasedHiddenTotalCount,
  setSelectHiddenBooks,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData } from '../../book/sagas';
import { fetchPurchasedHiddenItems, fetchPurchasedHiddenItemsTotalCount } from './requests';
import { toFlatten } from '../../../utils/array';
import { getHiddenItems, getItemsByPage, getSelectedHiddenBooks } from './selectors';

import { getRevision, requestShow, requestCheckQueueStatus } from '../../common/requests';
import { getBookIdsByUnitIdsForHidden } from '../../common/sagas';
import { showToast } from '../../toast/actions';

function* loadPurchasedHiddenItems() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPurchasedHiddenPage(page));

  const [itemResponse, countResponse] = yield all([call(fetchPurchasedHiddenItems, page), call(fetchPurchasedHiddenItemsTotalCount)]);
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([put(setPurchasedHiddenItems(itemResponse.items)), put(setPurchasedHiddenTotalCount(countResponse.item_total_count))]);
}

function* showSelectedBooks() {
  const items = yield select(getHiddenItems);
  const selectedBooks = yield select(getSelectedHiddenBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
  const queueIds = yield call(requestShow, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
  yield call(loadPurchasedHiddenItems);
}

function* deleteSelectedBooks() {
  const items = yield select(getHiddenItems);
  const selectedBooks = yield select(getSelectedHiddenBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
  // TODO: CSRF Token 어떻게 할지 결정되어야 한다.
  console.log('삭제 되었따고 치고');

  yield call(delay, 3000); // Temporary Sleep

  yield call(loadPurchasedHiddenItems);
}

function* selectAllHiddenBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(setSelectHiddenBooks(bookIds));
}

export default function* purchasedHiddenSaga() {
  yield all([
    takeEvery(LOAD_PURCHASED_HIDDEN_ITEMS, loadPurchasedHiddenItems),
    takeEvery(SHOW_SELECTED_BOOKS, showSelectedBooks),
    takeEvery(DELETE_SELECTED_BOOKS, deleteSelectedBooks),
    takeEvery(SELECT_ALL_HIDDEN_BOOKS, selectAllHiddenBooks),
  ]);
}

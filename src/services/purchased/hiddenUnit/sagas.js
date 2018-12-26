import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  DELETE_SELECTED_HIDDEN_UNIT_BOOKS,
  LOAD_HIDDEN_UNIT_ITEMS,
  SELECT_ALL_HIDDEN_UNIT_BOOKS,
  setItems,
  setPage,
  setTotalCount,
  selectBooks,
  UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS,
  setUnit,
} from './actions';
import { fetchHiddenUnitItems, fetchHiddenUnitItemsTotalCount } from './requests';

import { loadBookData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getOptions, getUnitId, getItemsByPage, getSelectedBooks } from './selectors';

import { toFlatten } from '../../../utils/array';
import { getRevision, requestCheckQueueStatus, requestUnhide } from '../../common/requests';
import { showToast } from '../../toast/actions';
import { delay } from 'redux-saga';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  yield all([put(setPage(page))]);
}

function* loadHiddenUnitItems() {
  yield call(persistPageOptionsFromQueries);

  const unitId = yield select(getUnitId);
  const { page } = yield select(getOptions);

  const [itemResponse, countResponse] = yield all([call(fetchHiddenUnitItems, unitId, page), call(fetchHiddenUnitItemsTotalCount, unitId)]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);

  yield all([
    put(setItems(itemResponse.items)),
    put(setUnit(itemResponse.unit)),
    put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
  ]);
}

function* unhideSelectedHiddenUnitBooks() {
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = Object.keys(selectedBooks);
  const queueIds = yield call(requestUnhide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
  yield call(loadHiddenUnitItems);
}

function* deleteSelectedHiddenUnitBooks() {
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = Object.keys(selectedBooks);
  // TODO: CSRF Token 어떻게 할지 결정되어야 한다.
  console.log('삭제 되었따고 치고');

  yield call(delay, 3000); // Temporary Sleep

  yield call(loadHiddenUnitItems);
}

function* selectAllHiddenUnitBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(selectBooks(bookIds));
}

export default function* purchaseHiddenUnitRootSaga() {
  yield all([
    takeEvery(LOAD_HIDDEN_UNIT_ITEMS, loadHiddenUnitItems),
    takeEvery(SELECT_ALL_HIDDEN_UNIT_BOOKS, selectAllHiddenUnitBooks),
    takeEvery(UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS, unhideSelectedHiddenUnitBooks),
    takeEvery(DELETE_SELECTED_HIDDEN_UNIT_BOOKS, deleteSelectedHiddenUnitBooks),
  ]);
}

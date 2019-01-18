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
  setIsFetchingHiddenBook,
} from './actions';
import { fetchHiddenUnitItems, fetchHiddenUnitItemsTotalCount } from './requests';

import { loadBookData, saveUnitData, loadBookDescriptions } from '../../book/sagas';
import { getOptions, getUnitId, getItemsByPage, getSelectedBooks } from './selectors';

import { toFlatten } from '../../../utils/array';
import { getRevision, requestCheckQueueStatus, requestDelete, requestUnhide } from '../../common/requests';
import { showToast } from '../../toast/actions';
import { getQuery } from '../../router/selectors';


function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  yield all([put(setPage(page))]);
}

function* loadHiddenUnitItems() {
  yield call(persistPageOptionsFromQueries);

  const unitId = yield select(getUnitId);
  const { page } = yield select(getOptions);

  yield put(setIsFetchingHiddenBook(true));
  const [itemResponse, countResponse] = yield all([call(fetchHiddenUnitItems, unitId, page), call(fetchHiddenUnitItemsTotalCount, unitId)]);

  yield call(saveUnitData, [itemResponse.unit]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield call(loadBookDescriptions, bookIds);
  yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.item_total_count))]);

  yield put(setIsFetchingHiddenBook(false));
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
  const queueIds = yield call(requestDelete, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
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

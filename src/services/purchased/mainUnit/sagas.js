import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS,
  HIDE_SELECTED_MAIN_UNIT_BOOKS,
  LOAD_MAIN_UNIT_ITEMS,
  SELECT_ALL_MAIN_UNIT_BOOKS,
  setItems,
  setOrder,
  setPage,
  setTotalCount,
  selectBooks,
  setIsFetchingBook,
} from './actions';
import { fetchMainUnitItems, fetchMainUnitItemsTotalCount } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';

import { loadBookData, saveUnitData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';

import { toFlatten } from '../../../utils/array';
import { getOptions, getUnitId, getItemsByPage, getSelectedBooks } from './selectors';
import { download } from '../../common/sagas';
import { getRevision, requestCheckQueueStatus, requestHide, triggerDownload } from '../../common/requests';
import { showToast } from '../../toast/actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);

  const { order_type: orderType = MainOrderOptions.DEFAULT.order_type, order_by: orderBy = MainOrderOptions.DEFAULT.order_by } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);

  yield put(setOrder(order));
}

function* loadItems() {
  yield call(persistPageOptionsFromQueries);

  const unitId = yield select(getUnitId);
  const { page, order } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);
  const nextPage = page + 1;

  yield put(setIsFetchingBook(true));
  const [itemResponse, countResponse] = yield all([
    call(fetchMainUnitItems, unitId, orderType, orderBy, nextPage),
    call(fetchMainUnitItemsTotalCount, unitId, orderType, orderBy),
  ]);

  yield call(saveUnitData, [itemResponse.unit]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);

  yield all([
    put(setItems(itemResponse.items)),
    put(setTotalCount(countResponse.item_total_count)),
    put(setPage(nextPage)),
    put(setIsFetchingBook(false)),
  ]);
}

function* hideSelectedBooks() {
  const selectedBooks = yield select(getSelectedBooks);

  const bookIds = Object.keys(selectedBooks);

  const revision = yield call(getRevision);
  const queueIds = yield call(requestHide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
  yield call(loadItems);
}

function* downloadSelectedBooks() {
  const selectedBooks = yield select(getSelectedBooks);

  const bookIds = Object.keys(selectedBooks);

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
  yield put(selectBooks(bookIds));
}

export default function* purchaseMainUnitRootSaga() {
  yield all([
    takeEvery(LOAD_MAIN_UNIT_ITEMS, loadItems),
    takeEvery(HIDE_SELECTED_MAIN_UNIT_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_MAIN_UNIT_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_MAIN_UNIT_BOOKS, selectAllBooks),
  ]);
}

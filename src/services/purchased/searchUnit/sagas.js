import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS,
  HIDE_SELECTED_SEARCH_UNIT_BOOKS,
  LOAD_SEARCH_UNIT_ITEMS,
  SELECT_ALL_SEARCH_UNIT_BOOKS,
  setSearchUnitFilter,
  setSearchUnitFilterOptions,
  setSearchUnitItems,
  setSearchUnitOrder,
  setSearchUnitPage,
  setSearchUnitTotalCount,
  setSelectSearchUnitBooks,
} from './actions';
import { fetchSearchUnitItems, fetchSearchUnitItemsTotalCount } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';

import { loadBookData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getOptions, getUnitId } from './selectors';

import { toFlatten } from '../../../utils/array';
import { getItemsByPage, getSelectedBooks } from './selectors';
import { download } from '../../common/sagas';
import { getRevision, requestCheckQueueStatus, requestHide, triggerDownload } from '../../common/requests';
import { showToast } from '../../toast/actions';

function* persistPageOptionsFromQuries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = MainOrderOptions.DEFAULT.order_type, order_by: orderBy = MainOrderOptions.DEFAULT.order_by } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);
  const filter = parseInt(query.filter, 10) || null;

  yield all([put(setSearchUnitPage(page)), put(setSearchUnitOrder(order)), put(setSearchUnitFilter(filter))]);
}

function* loadSearchUnitItems() {
  yield call(persistPageOptionsFromQuries);

  const unitId = yield select(getUnitId);
  const { page, order, filter: category } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  const [itemResponse, countResponse, categories] = yield all([
    call(fetchSearchUnitItems, unitId, orderType, orderBy, category, page),
    call(fetchSearchUnitItemsTotalCount, unitId, orderType, orderBy, category),
  ]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);

  yield all([
    put(setSearchUnitItems(itemResponse.items)),
    put(setSearchUnitTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setSearchUnitFilterOptions(categories)),
  ]);
}

function* hideSelectedSearchUnitBooks() {
  const selectedBooks = yield select(getSelectedBooks);

  const bookIds = Object.keys(selectedBooks);

  const revision = yield call(getRevision);
  const queueIds = yield call(requestHide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
  yield call(loadSearchUnitItems);
}

function* downloadSelectedSearchUnitBooks() {
  const selectedBooks = yield select(getSelectedBooks);

  const bookIds = Object.keys(selectedBooks);

  const triggerResponse = yield call(triggerDownload, bookIds);
  if (triggerResponse.result) {
    yield call(download, triggerResponse.b_ids, triggerResponse.url);
  } else {
    yield put(showToast(triggerResponse.message));
  }
}

function* selectAllSearchUnitBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(setSelectSearchUnitBooks(bookIds));
}

export default function* purchaseSearchUnitRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_UNIT_ITEMS, loadSearchUnitItems),
    takeEvery(HIDE_SELECTED_SEARCH_UNIT_BOOKS, hideSelectedSearchUnitBooks),
    takeEvery(DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS, downloadSelectedSearchUnitBooks),
    takeEvery(SELECT_ALL_SEARCH_UNIT_BOOKS, selectAllSearchUnitBooks),
  ]);
}

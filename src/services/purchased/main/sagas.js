import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_ITEMS,
  HIDE_SELECTED_BOOKS,
  DOWNLOAD_SELECTED_BOOKS,
  SELECT_ALL_MAIN_BOOKS,
  setPurchaseItems,
  setPurchaseTotalCount,
  setPurchasePage,
  setPurchaseOrder,
  setPurchaseFilter,
  setPurchaseFilterOptions,
  setSelectBooks,
} from './actions';
import { showToast } from '../../toast/actions';
import { fetchPurchaseItems, fetchPurchaseItemsTotalCount, fetchPurchaseCategories } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';
import { toFlatten } from '../../../utils/array';

import { getQuery } from '../../router/selectors';
import { getPurchaseOptions, getSelectedBooks, getItems, getItemsByPage } from './selectors';

import { loadBookData } from '../../book/sagas';
import { getRevision, triggerDownload, requestHide, requestCheckQueueStatus } from '../../common/requests';
import { download, getBookIdsByUnitIds } from '../../common/sagas';

function* persistPageOptionsFromQuries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = MainOrderOptions.DEFAULT.order_type, order_by: orderBy = MainOrderOptions.DEFAULT.order_by } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);
  const filter = parseInt(query.filter, 10) || null;

  yield all([put(setPurchasePage(page)), put(setPurchaseOrder(order)), put(setPurchaseFilter(filter))]);
}

function* loadPurchaseItems() {
  yield call(persistPageOptionsFromQuries);

  const { page, order, filter: category } = yield select(getPurchaseOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  const [itemResponse, countResponse, categories] = yield all([
    call(fetchPurchaseItems, orderType, orderBy, category, page),
    call(fetchPurchaseItemsTotalCount, orderType, orderBy, category),
    call(fetchPurchaseCategories),
  ]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);

  yield all([
    put(setPurchaseItems(itemResponse.items)),
    put(setPurchaseTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setPurchaseFilterOptions(categories)),
  ]);
}

function* hideSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const { order } = yield select(getPurchaseOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);
  const bookIds = yield call(getBookIdsByUnitIds, items, Object.keys(selectedBooks), orderType, orderBy);

  const revision = yield call(getRevision);
  const queueIds = yield call(requestHide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  // TODO: Message 수정
  yield put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.'));
  yield call(loadPurchaseItems);
}

function* downloadSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const { order } = yield select(getPurchaseOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);
  const bookIds = yield call(getBookIdsByUnitIds, items, Object.keys(selectedBooks), orderType, orderBy);

  const triggerResponse = yield call(triggerDownload, bookIds);
  if (triggerResponse.result) {
    yield call(download, triggerResponse.b_ids, triggerResponse.url);
  } else {
    yield put(showToast(triggerResponse.message));
  }
}

function* selectAllMainBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(setSelectBooks(bookIds));
}

export default function* purchaseMainRootSaga() {
  yield all([
    takeEvery(LOAD_PURCHASE_ITEMS, loadPurchaseItems),
    takeEvery(HIDE_SELECTED_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_MAIN_BOOKS, selectAllMainBooks),
  ]);
}

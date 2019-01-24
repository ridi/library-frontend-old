import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { downloadBooks } from '../../common/sagas';

import {
  DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS,
  HIDE_SELECTED_SEARCH_UNIT_BOOKS,
  LOAD_SEARCH_UNIT_ITEMS,
  SELECT_ALL_SEARCH_UNIT_BOOKS,
  setItems,
  setOrder,
  setPage,
  setTotalCount,
  selectBooks,
  setKeyword,
  setIsFetchingSearchBook,
  setSearchUnitPrimaryItem,
} from './actions';
import { fetchSearchUnitItems, fetchSearchUnitItemsTotalCount, getSearchUnitPrimaryItem } from './requests';

import { UnitOrderOptions } from '../../../constants/orderOptions';

import { loadBookData, loadBookDescriptions, saveUnitData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getOptions, getUnitId, getItemsByPage, getSelectedBooks, getPrimaryItem } from './selectors';

import { toFlatten } from '../../../utils/array';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { showToast } from '../../toast/actions';
import { isExpiredTTL } from '../../../utils/ttl';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);

  const page = parseInt(query.page, 10) || 1;
  const { order_type: orderType = UnitOrderOptions.DEFAULT.orderType, order_by: orderBy = UnitOrderOptions.DEFAULT.orderBy } = query;
  const order = UnitOrderOptions.toIndex(orderType, orderBy);

  yield all([put(setPage(page)), put(setOrder(order)), put(setKeyword(query.keyword))]);
}

function* loadPrimaryItem(unitId) {
  const _primaryItem = yield select(getPrimaryItem);
  if (_primaryItem && !isExpiredTTL(_primaryItem)) {
    return _primaryItem;
  }

  const primaryItem = yield call(getSearchUnitPrimaryItem, unitId);
  yield put(setSearchUnitPrimaryItem(primaryItem));
  return primaryItem;
}

function* loadItems() {
  yield call(persistPageOptionsFromQueries);

  const unitId = yield select(getUnitId);
  const { page, order } = yield select(getOptions);
  const { orderType, orderBy } = UnitOrderOptions.parse(order);

  yield put(setIsFetchingSearchBook(true));
  const [itemResponse, countResponse] = yield all([
    call(fetchSearchUnitItems, unitId, orderType, orderBy, page),
    call(fetchSearchUnitItemsTotalCount, unitId, orderType, orderBy),
  ]);

  // PrimaryItem과 Unit 저장
  const primaryItem = yield call(loadPrimaryItem, unitId);
  yield call(saveUnitData, [itemResponse.unit]);

  // 책 데이터 로딩
  const bookIds = [...toFlatten(itemResponse.items, 'b_id'), primaryItem.b_id];
  yield call(loadBookData, bookIds);
  yield call(loadBookDescriptions, bookIds);
  yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.item_total_count))]);

  yield put(setIsFetchingSearchBook(false));
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

  yield call(downloadBooks, bookIds);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(selectBooks(bookIds));
}

export default function* purchaseSearchUnitRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_UNIT_ITEMS, loadItems),
    takeEvery(HIDE_SELECTED_SEARCH_UNIT_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_SEARCH_UNIT_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_SEARCH_UNIT_BOOKS, selectAllBooks),
  ]);
}

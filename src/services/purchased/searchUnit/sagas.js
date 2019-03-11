import Router from 'next/router';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { downloadBooks } from '../../bookDownload/sagas';
import { isTotalSeriesView, loadTotalItems } from '../common/sagas';

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
  setPrimaryItem,
} from './actions';
import { fetchSearchUnitItems, fetchSearchUnitItemsTotalCount, getSearchUnitPrimaryItem } from './requests';

import { OrderOptions } from '../../../constants/orderOptions';

import { loadBookData, loadBookDescriptions, loadBookStarRatings, loadUnitData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getOptions, getUnitId, getItemsByPage, getSelectedBooks, getPrimaryItem } from './selectors';

import { toFlatten } from '../../../utils/array';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { showToast } from '../../toast/actions';
import { isExpiredTTL } from '../../../utils/ttl';
import { setFullScreenLoading, setError } from '../../ui/actions';
import { makeLinkProps } from '../../../utils/uri';
import { URLMap } from '../../../constants/urls';
import { showDialog } from '../../dialog/actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);

  const page = parseInt(query.page, 10) || 1;
  const {
    order_type: orderType = OrderOptions.UNIT_LIST_DEFAULT.orderType,
    order_by: orderBy = OrderOptions.UNIT_LIST_DEFAULT.orderBy,
  } = query;
  const order = OrderOptions.toKey(orderType, orderBy);

  yield all([put(setPage(page)), put(setOrder(order)), put(setKeyword(query.keyword))]);
}

function* loadPrimaryItem(unitId) {
  const _primaryItem = yield select(getPrimaryItem);
  if (_primaryItem && !isExpiredTTL(_primaryItem)) {
    return _primaryItem;
  }

  return yield call(getSearchUnitPrimaryItem, unitId);
}

function* moveToFirstPage() {
  const query = yield select(getQuery);
  const unitId = yield select(getUnitId);

  const linkProps = makeLinkProps({ pathname: URLMap.searchUnit.href, query: { unitId } }, URLMap.searchUnit.as({ unitId }), {
    ...query,
    page: 1,
  });

  Router.replace(linkProps.href, linkProps.as);
}

function* loadOwnItems(unitId, orderType, orderBy, page) {
  const [itemResponse, countResponse] = yield all([
    call(fetchSearchUnitItems, unitId, orderType, orderBy, page),
    call(fetchSearchUnitItemsTotalCount, unitId, orderType, orderBy),
  ]);

  // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
  if (!itemResponse.items.length && countResponse.item_total_count) {
    yield moveToFirstPage();
    return;
  }

  yield all([
    call(loadBookData, toFlatten(itemResponse.items, 'b_id')),
    put(setItems(itemResponse.items)),
    put(setTotalCount(countResponse.item_total_count)),
  ]);
}

function* loadItems() {
  yield put(setError(false));
  yield call(persistPageOptionsFromQueries);

  const unitId = yield select(getUnitId);
  const { page, order } = yield select(getOptions);
  const { orderType, orderBy } = OrderOptions.parse(order);

  try {
    yield put(setIsFetchingSearchBook(true));

    // Unit 로딩
    const [_, primaryItem] = yield all([call(loadUnitData, [unitId]), call(loadPrimaryItem, unitId)]);
    yield all([
      put(setPrimaryItem(primaryItem)),
      call(loadBookDescriptions, [primaryItem.b_id]),
      call(loadBookStarRatings, [primaryItem.b_id]),
    ]);

    if (yield call(isTotalSeriesView, unitId, order)) {
      yield loadTotalItems(unitId, orderType, orderBy, page, setItems, setTotalCount);
    } else {
      yield loadOwnItems(unitId, orderType, orderBy, page);
    }
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setIsFetchingSearchBook(false));
  }
}

function* hideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedBooks);

  let queueIds;
  try {
    const bookIds = Object.keys(selectedBooks);
    const revision = yield call(getRevision);
    queueIds = yield call(requestHide, bookIds, revision);
  } catch (err) {
    yield all([
      put(showDialog('도서 숨기기 오류', '숨기기 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')),
      put(setFullScreenLoading(false)),
    ]);
    return;
  }

  let isFinish = false;
  try {
    isFinish = yield call(requestCheckQueueStatus, queueIds);
  } catch (err) {
    isFinish = false;
  }

  if (isFinish) {
    yield call(loadItems);
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
  const selectedBooks = yield select(getSelectedBooks);
  try {
    const bookIds = Object.keys(selectedBooks);
    yield call(downloadBooks, bookIds);
  } catch (err) {
    yield put(showDialog('다운로드 오류', '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'));
  }
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

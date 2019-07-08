import Router from 'next/router';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';

import { OrderOptions } from '../../constants/orderOptions';
import { URLMap } from '../../constants/urls';

import { toFlatten } from '../../utils/array';
import { isExpiredTTL } from '../../utils/ttl';
import { makeLinkProps } from '../../utils/uri';

import { loadBookData, loadBookDescriptions, loadBookStarRatings, loadUnitData } from '../book/sagas';
import { downloadBooks } from '../bookDownload/sagas';
import { getRevision, requestCheckQueueStatus, requestHide } from '../common/requests';
import { showDialog } from '../dialog/actions';
import { showToast } from '../toast/actions';
import { setError, setFullScreenLoading } from '../ui/actions';
import { loadReadLatestBookId } from '../purchased/common/sagas/rootSagas';
import { isTotalSeriesView, loadTotalItems } from '../purchased/common/sagas/seriesViewSagas';

import {
  DOWNLOAD_SELECTED_UNIT_BOOKS,
  HIDE_SELECTED_UNIT_BOOKS,
  LOAD_UNIT_ITEMS,
  SELECT_ALL_UNIT_BOOKS,
  setIsFetchingBook,
  setItems,
  setPrimaryItem,
  setPurchasedTotalCount,
  setTotalCount,
} from './actions';
import * as mainUnitRequests from '../purchased/mainUnit/requests';
import * as searchUnitRequests from '../purchased/searchUnit/requests';
import { getItemsByPage, getPrimaryItem } from './selectors';
import { fetchPrimaryBookId } from '../book/requests';
import { setPrimaryBookId } from '../purchased/common/actions';
import { selectItems } from '../selection/actions';
import { getSelectedItems } from '../selection/selectors';

function* loadPrimaryItem(kind, unitId) {
  const primaryItem = yield select(getPrimaryItem, unitId);
  if (primaryItem && !isExpiredTTL(primaryItem)) {
    return primaryItem;
  }
  let primaryItemEffect;
  if (kind === 'main') {
    primaryItemEffect = call(mainUnitRequests.getMainUnitPrimaryItem, unitId);
  } else if (kind === 'search') {
    primaryItemEffect = call(searchUnitRequests.getSearchUnitPrimaryItem, unitId);
  }
  try {
    return yield primaryItemEffect;
  } catch (err) {
    return null;
  }
}

function* loadPurchasedItems(kind, options) {
  const { unitId, orderType, orderBy, page } = options;
  let itemResponse;
  let countResponse;
  if (kind === 'main') {
    [itemResponse, countResponse] = yield all([
      call(mainUnitRequests.fetchMainUnitItems, unitId, orderType, orderBy, page),
      call(mainUnitRequests.fetchMainUnitItemsTotalCount, unitId, orderType, orderBy),
    ]);
  } else if (kind === 'search') {
    [itemResponse, countResponse] = yield all([
      call(searchUnitRequests.fetchSearchUnitItems, unitId, orderType, orderBy, page),
      call(searchUnitRequests.fetchSearchUnitItemsTotalCount, unitId, orderType, orderBy),
    ]);
  }

  // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
  if (!itemResponse.items.length && countResponse.item_total_count) {
    return;
  }

  yield all([
    call(loadBookData, toFlatten(itemResponse.items, 'b_id')),
    put(setItems(itemResponse.items, options)),
    put(setTotalCount(countResponse.item_total_count, options)),
  ]);
}

function* loadItems(action) {
  yield put(setError(false));

  const { kind, unitId, page, orderType, orderBy } = action.payload;
  const order = OrderOptions.toKey(orderType, orderBy);
  const options = {
    unitId,
    orderType,
    orderBy,
    page,
  };

  try {
    yield put(setIsFetchingBook(true));

    // Unit 로딩
    let countEffect;
    if (kind === 'main') {
      countEffect = call(
        mainUnitRequests.fetchMainUnitItemsTotalCount,
        unitId,
        OrderOptions.PURCHASE_DATE.orderType,
        OrderOptions.PURCHASE_DATE.orderBy,
      );
    } else if (kind === 'search') {
      countEffect = call(
        searchUnitRequests.fetchSearchUnitItemsTotalCount,
        unitId,
        OrderOptions.PURCHASE_DATE.orderType,
        OrderOptions.PURCHASE_DATE.orderBy,
      );
    }
    const [, primaryItem, countResponse] = yield all([call(loadUnitData, [unitId]), call(loadPrimaryItem, kind, unitId), countEffect]);
    const primaryBookId = primaryItem ? primaryItem.b_id : yield call(fetchPrimaryBookId, unitId);

    yield fork(loadReadLatestBookId, unitId, primaryBookId);

    yield all([
      put(setPrimaryBookId(unitId, primaryBookId)),
      put(setPrimaryItem(unitId, primaryItem)),
      put(setPurchasedTotalCount(countResponse.item_total_count, options)),
      call(loadBookDescriptions, [primaryBookId]),
      call(loadBookStarRatings, [primaryBookId]),
    ]);

    if (yield call(isTotalSeriesView, unitId, order)) {
      yield loadTotalItems(unitId, orderType, orderBy, page, setItems, setTotalCount);
    } else {
      yield loadPurchasedItems(action.payload);
    }
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setIsFetchingBook(false));
  }
}

function* hideSelectedBooks(action) {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedItems);

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
    yield call(loadItems, action);
  }
  yield all([
    put(
      showToast({
        message: isFinish ? '내 서재에서 숨겼습니다.' : '내 서재에서 숨겼습니다. 잠시후 반영 됩니다.',
        linkName: '숨긴 도서 목록 보기',
        linkProps: makeLinkProps(URLMap.hidden.href, URLMap.hidden.as),
      }),
    ),
    put(setFullScreenLoading(false)),
  ]);
}

function* downloadSelectedBooks() {
  const selectedBooks = yield select(getSelectedItems);

  try {
    const bookIds = Object.keys(selectedBooks);
    yield call(downloadBooks, bookIds);
  } catch (err) {
    yield put(showDialog('다운로드 오류', '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'));
  }
}

function* selectAllBooks(action) {
  const items = yield select(getItemsByPage, action.payload);
  const bookIds = toFlatten(items.filter(item => item.purchased), 'b_id');
  yield put(selectItems(bookIds));
}

export default function* UnitPageRootSaga() {
  yield all([
    takeEvery(LOAD_UNIT_ITEMS, loadItems),
    takeEvery(HIDE_SELECTED_UNIT_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_UNIT_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_UNIT_BOOKS, selectAllBooks),
  ]);
}

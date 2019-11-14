import { all, call, fork, join, put, select, takeEvery } from 'redux-saga/effects';
import { OrderOptions } from '../../constants/orderOptions';
import { URLMap, PageType } from '../../constants/urls';
import { toFlatten } from '../../utils/array';
import { isExpiredTTL } from '../../utils/ttl';
import { makeLinkProps } from '../../utils/uri';
import { fetchPrimaryBookId } from '../book/requests';
import { loadBookData, loadBookDescriptions, loadBookStarRatings, loadUnitData } from '../book/sagas';
import { downloadBooks } from '../bookDownload/sagas';
import * as commonRequests from '../common/requests';
import { showDialog } from '../dialog/actions';
import { setPrimaryBookId } from '../purchased/common/actions';
import { loadReadLatestBookId } from '../purchased/common/sagas/rootSagas';
import { selectItems } from '../selection/actions';
import { getSelectedItems } from '../selection/selectors';
import { showToast } from '../toast/actions';
import { setError, setFullScreenLoading } from '../ui/actions';
import * as actions from './actions';
import * as requests from './requests';
import { getItemsByPage, getPrimaryItem } from './selectors';
import { isTotalSeriesView, loadTotalItems } from './seriesViewSagas';

function* loadPrimaryItem(kind, unitId) {
  const primaryItem = yield select(getPrimaryItem, kind, unitId);
  if (primaryItem && !isExpiredTTL(primaryItem)) {
    return primaryItem;
  }
  try {
    return yield call(requests.getUnitPrimaryItem, { kind, unitId });
  } catch (err) {
    return null;
  }
}

function* loadPurchasedItems(options) {
  const [itemResponse, countResponse] = yield all([
    call(requests.fetchUnitItems, options),
    call(requests.fetchUnitItemsTotalCount, options),
  ]);

  // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
  if (!itemResponse.items.length && countResponse.item_total_count) {
    return;
  }

  yield all([
    call(loadBookData, toFlatten(itemResponse.items, 'b_id')),
    put(actions.setItems(itemResponse.items, options)),
    put(actions.setTotalCount(countResponse.item_total_count, options)),
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
    yield put(actions.setIsFetchingBook(true));
    yield call(loadUnitData, [unitId]);

    const basicTask = yield fork(function* loadBasicData() {
      const primaryItem = yield call(loadPrimaryItem, kind, unitId);
      const primaryBookId = primaryItem ? primaryItem.b_id : yield call(fetchPrimaryBookId, unitId);
      if (kind === PageType.HIDDEN) {
        yield call(loadBookData, [primaryBookId]);
      } else {
        yield fork(loadReadLatestBookId, unitId, primaryBookId);
      }
      yield all([
        put(setPrimaryBookId(unitId, primaryBookId)),
        put(actions.setPrimaryItem(kind, unitId, primaryItem)),
        call(loadBookDescriptions, [primaryBookId]),
        call(loadBookStarRatings, [primaryBookId]),
      ]);
      return primaryItem;
    });

    if (kind === PageType.HIDDEN) {
      yield loadPurchasedItems(action.payload);
      yield join(basicTask);
      return;
    }

    const countResponse = yield call(requests.fetchUnitItemsTotalCount, {
      ...action.payload,
      orderType: OrderOptions.PURCHASE_DATE.orderType,
      orderBy: OrderOptions.PURCHASE_DATE.orderBy,
    });

    yield put(actions.setPurchasedTotalCount(countResponse.item_total_count, options));

    if (yield call(isTotalSeriesView, unitId, order)) {
      yield loadTotalItems(unitId, orderType, orderBy, page, actions.setItems, actions.setTotalCount);
    } else {
      yield loadPurchasedItems(action.payload);
    }
    yield join(basicTask);
  } catch (err) {
    console.error(err);
    yield put(setError(true));
  } finally {
    yield put(actions.setIsFetchingBook(false));
  }
}

function* requestActionToSelection(request) {
  const selectedBooks = yield select(getSelectedItems);
  const bookIds = Object.keys(selectedBooks);
  const revision = yield call(commonRequests.getRevision);
  const queueIds = yield call(request, bookIds, revision);

  let isFinish = false;
  try {
    isFinish = yield call(commonRequests.requestCheckQueueStatus, queueIds);
  } catch (err) {
    isFinish = false;
  }

  return {
    queueIds,
    isFinish,
  };
}

function* hideSelectedBooks(action) {
  yield put(setFullScreenLoading(true));
  let isFinish;
  try {
    ({ isFinish } = yield call(requestActionToSelection, commonRequests.requestHide));
  } catch (err) {
    yield all([
      put(showDialog('도서 숨기기 오류', '숨기기 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')),
      put(setFullScreenLoading(false)),
    ]);
    return;
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

function* unhideSelectedBooks(action) {
  yield put(setFullScreenLoading(true));
  let isFinish;
  try {
    ({ isFinish } = yield call(requestActionToSelection, commonRequests.requestUnhide));
  } catch (err) {
    yield all([
      put(showDialog('도서 숨김 해제 오류', '숨김 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')),
      put(setFullScreenLoading(false)),
    ]);
    return;
  }

  if (isFinish) {
    yield call(loadItems, action);
  }

  yield all([
    put(
      showToast({
        message: isFinish ? '숨김 해제되었습니다.' : '숨김 해제되었습니다. 잠시후 반영 됩니다.',
        linkName: '내 서재 바로가기',
        linkProps: makeLinkProps(URLMap.main.href, URLMap.main.as),
      }),
    ),
    put(setFullScreenLoading(false)),
  ]);
}

function* deleteSelectedBooks(action) {
  yield put(setFullScreenLoading(true));
  let isFinish;
  try {
    ({ isFinish } = yield call(requestActionToSelection, commonRequests.requestDelete));
  } catch (err) {
    yield all([
      put(showDialog('영구 삭제 오류', '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')),
      put(setFullScreenLoading(false)),
    ]);
    return;
  }

  if (isFinish) {
    yield call(loadItems, action);
  }

  yield all([put(showToast({ message: isFinish ? '영구 삭제 되었습니다.' : '잠시후 반영 됩니다.' })), put(setFullScreenLoading(false))]);
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
  const bookIds = toFlatten(
    items.filter(item => item.purchased),
    'b_id',
  );
  yield put(selectItems(bookIds));
}

export default function* UnitPageRootSaga() {
  yield all([
    takeEvery(actions.LOAD_UNIT_ITEMS, loadItems),
    takeEvery(actions.HIDE_SELECTED_UNIT_BOOKS, hideSelectedBooks),
    takeEvery(actions.UNHIDE_SELECTED_UNIT_BOOKS, unhideSelectedBooks),
    takeEvery(actions.DELETE_SELECTED_UNIT_BOOKS, deleteSelectedBooks),
    takeEvery(actions.DOWNLOAD_SELECTED_UNIT_BOOKS, downloadSelectedBooks),
    takeEvery(actions.SELECT_ALL_UNIT_BOOKS, selectAllBooks),
  ]);
}

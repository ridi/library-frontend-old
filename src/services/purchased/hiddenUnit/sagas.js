import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { URLMap } from '../../../constants/urls';

import { toFlatten } from '../../../utils/array';
import { isExpiredTTL } from '../../../utils/ttl';
import { makeLinkProps } from '../../../utils/uri';

import { loadBookData, loadBookDescriptions, loadBookStarRatings, loadUnitData } from '../../book/sagas';
import { getRevision, requestCheckQueueStatus, requestDelete, requestUnhide } from '../../common/requests';
import { showDialog } from '../../dialog/actions';
import { getQuery } from '../../router/selectors';
import { showToast } from '../../toast/actions';
import { setFullScreenLoading, setError } from '../../ui/actions';

import {
  DELETE_SELECTED_HIDDEN_UNIT_BOOKS,
  LOAD_HIDDEN_UNIT_ITEMS,
  SELECT_ALL_HIDDEN_UNIT_BOOKS,
  UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS,
  setHiddenUnitPrimaryItem,
  setIsFetchingHiddenBook,
  setItems,
  setPage,
  setTotalCount,
} from './actions';
import { fetchHiddenUnitItems, fetchHiddenUnitItemsTotalCount, getHiddenUnitPrimaryItem } from './requests';
import { getItemsByPage, getOptions, getPrimaryItem, getUnitId } from './selectors';
import { fetchPrimaryBookId } from '../../book/requests';
import { setPrimaryBookId } from '../common/actions';
import { selectItems } from '../../selection/actions';
import { getSelectedItems } from '../../selection/selectors';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  yield all([put(setPage(page))]);
}

function* loadPrimaryItem(unitId) {
  const _primaryItem = yield select(getPrimaryItem);
  if (_primaryItem && !isExpiredTTL(_primaryItem)) {
    return _primaryItem;
  }

  return yield call(getHiddenUnitPrimaryItem, unitId);
}

function* moveToFirstPage() {
  const query = yield select(getQuery);
  const unitId = yield select(getUnitId);

  const linkProps = makeLinkProps({ pathname: URLMap.hiddenUnit.href, query: { unitId } }, URLMap.hiddenUnit.as({ unitId }), {
    ...query,
    page: 1,
  });

  Router.replace(linkProps.href, linkProps.as);
}

function* loadItems() {
  yield put(setError(false));
  yield call(persistPageOptionsFromQueries);

  const unitId = yield select(getUnitId);
  const { page } = yield select(getOptions);

  try {
    yield put(setIsFetchingHiddenBook(true));

    // Unit 로딩
    yield call(loadUnitData, [unitId]);

    const [itemResponse, countResponse, primaryItem] = yield all([
      call(fetchHiddenUnitItems, unitId, page),
      call(fetchHiddenUnitItemsTotalCount, unitId),
      call(loadPrimaryItem, unitId),
    ]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.item_total_count) {
      yield moveToFirstPage();
      return;
    }

    // 대표 책 데이터 로딩
    const primaryBookId = primaryItem ? primaryItem.b_id : yield call(fetchPrimaryBookId, unitId);
    yield all([
      put(setPrimaryBookId(unitId, primaryBookId)),
      put(setHiddenUnitPrimaryItem(primaryItem)),
      put(setItems(itemResponse.items)),
      put(setTotalCount(countResponse.item_total_count)),
      // 책 데이터 로딩
      call(loadBookDescriptions, [primaryBookId]),
      call(loadBookStarRatings, [primaryBookId]),
      call(loadBookData, [...toFlatten(itemResponse.items, 'b_id'), primaryBookId]),
    ]);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setIsFetchingHiddenBook(false));
  }
}

function* unhideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedItems);

  const revision = yield call(getRevision);
  const bookIds = Object.keys(selectedBooks);

  let queueIds;
  try {
    queueIds = yield call(requestUnhide, bookIds, revision);
  } catch (err) {
    yield all([
      put(showDialog('도서 숨김 해제 오류', '숨김 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')),
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
      showToast({
        message: isFinish ? '숨김 해제되었습니다.' : '숨김 해제되었습니다. 잠시후 반영 됩니다.',
        linkName: '내 서재 바로가기',
        linkProps: makeLinkProps(URLMap.main.href, URLMap.main.as),
      }),
    ),
    put(setFullScreenLoading(false)),
  ]);
}

function* deleteSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedItems);

  const revision = yield call(getRevision);
  const bookIds = Object.keys(selectedBooks);
  let queueIds;
  try {
    queueIds = yield call(requestDelete, bookIds, revision);
  } catch (err) {
    yield all([
      put(showDialog('영구 삭제 오류', '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')),
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

  yield all([put(showToast({ message: isFinish ? '영구 삭제 되었습니다.' : '잠시후 반영 됩니다.' })), put(setFullScreenLoading(false))]);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items.filter(item => item.purchased), 'b_id');
  yield put(selectItems(bookIds));
}

export default function* purchaseHiddenUnitRootSaga() {
  yield all([
    takeEvery(LOAD_HIDDEN_UNIT_ITEMS, loadItems),
    takeEvery(SELECT_ALL_HIDDEN_UNIT_BOOKS, selectAllBooks),
    takeEvery(UNHIDE_SELECTED_HIDDEN_UNIT_BOOKS, unhideSelectedBooks),
    takeEvery(DELETE_SELECTED_HIDDEN_UNIT_BOOKS, deleteSelectedBooks),
  ]);
}

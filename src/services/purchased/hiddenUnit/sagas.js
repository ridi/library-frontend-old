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
  setHiddenUnitPrimaryItem,
} from './actions';
import { fetchHiddenUnitItems, fetchHiddenUnitItemsTotalCount, getHiddenUnitPrimaryItem } from './requests';

import { loadBookData, saveUnitData, loadBookDescriptions } from '../../book/sagas';
import { getOptions, getUnitId, getItemsByPage, getSelectedBooks, getPrimaryItem } from './selectors';

import { toFlatten } from '../../../utils/array';
import { getRevision, requestCheckQueueStatus, requestDelete, requestUnhide } from '../../common/requests';
import { showToast } from '../../toast/actions';
import { getQuery } from '../../router/selectors';
import { isExpiredTTL } from '../../../utils/ttl';
import { setFullScreenLoading } from '../../fullScreenLoading/actions';
import { makeLinkProps } from '../../../utils/uri';
import { URLMap } from '../../../constants/urls';
import { showDialog } from '../../dialog/actions';

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

  const primaryItem = yield call(getHiddenUnitPrimaryItem, unitId);
  return primaryItem;
}

function* loadHiddenUnitItems() {
  yield call(persistPageOptionsFromQueries);

  const unitId = yield select(getUnitId);
  const { page } = yield select(getOptions);

  yield put(setIsFetchingHiddenBook(true));
  const [itemResponse, countResponse] = yield all([call(fetchHiddenUnitItems, unitId, page), call(fetchHiddenUnitItemsTotalCount, unitId)]);

  // PrimaryItem과 Unit 저장
  const primaryItem = yield call(loadPrimaryItem, unitId);
  yield call(saveUnitData, [itemResponse.unit]);

  // 책 데이터 로딩
  const bookIds = [...toFlatten(itemResponse.items, 'b_id'), primaryItem.b_id];
  yield call(loadBookData, bookIds);
  yield call(loadBookDescriptions, bookIds);
  yield all([
    put(setHiddenUnitPrimaryItem(primaryItem)),
    put(setItems(itemResponse.items)),
    put(setTotalCount(countResponse.item_total_count)),
  ]);

  yield put(setIsFetchingHiddenBook(false));
}

function* unhideSelectedHiddenUnitBooks() {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = Object.keys(selectedBooks);

  let queueIds;
  try {
    queueIds = yield call(requestUnhide, bookIds, revision);
  } catch (err) {
    yield put(showDialog('도서 숨김 해제 오류', '숨김 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'));
    return;
  }

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadHiddenUnitItems);
  }

  yield all([
    put(
      showToast(
        isFinish ? '숨김 해제되었습니다.' : '숨김 해제되었습니다. 잠시후 반영 됩니다.',
        '내 서재 바로가기',
        makeLinkProps(URLMap.main.href, URLMap.main.as),
      ),
    ),
    put(setFullScreenLoading(false)),
  ]);
}

function* deleteSelectedHiddenUnitBooks() {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = Object.keys(selectedBooks);
  let queueIds;
  try {
    queueIds = yield call(requestDelete, bookIds, revision);
  } catch (err) {
    yield put(showDialog('영구 삭제 오류', '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'));
    return;
  }

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadHiddenUnitItems);
  }

  // 메시지수정
  yield all([put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.')), put(setFullScreenLoading(false))]);
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

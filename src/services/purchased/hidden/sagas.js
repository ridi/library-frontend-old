import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_HIDDEN_ITEMS,
  SELECT_ALL_HIDDEN_BOOKS,
  UNHIDE_SELECTED_HIDDEN_BOOKS,
  DELETE_SELECTED_HIDDEN_BOOKS,
  setItems,
  setPage,
  setTotalCount,
  selectBooks,
  setHiddenIsFetchingBooks,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData, extractUnitData } from '../../book/sagas';
import { fetchHiddenItems, fetchHiddenItemsTotalCount } from './requests';
import { toFlatten } from '../../../utils/array';
import { getOptions, getItems, getItemsByPage, getSelectedBooks } from './selectors';

import { getRevision, requestUnhide, requestCheckQueueStatus, requestDelete } from '../../common/requests';
import { getBookIdsByUnitIdsForHidden } from '../../common/sagas';
import { showToast } from '../../toast/actions';
import { setFullScreenLoading } from '../../fullScreenLoading/actions';
import { makeLinkProps } from '../../../utils/uri';
import { URLMap } from '../../../constants/urls';
import { showDialog } from '../../dialog/actions';
import { UnhideError, MakeBookIdsError } from '../../common/errors';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPage(page));
}

function* loadItems() {
  yield call(persistPageOptionsFromQueries);

  const { page } = yield select(getOptions);

  yield put(setHiddenIsFetchingBooks(true));
  const [itemResponse, countResponse] = yield all([call(fetchHiddenItems, page), call(fetchHiddenItemsTotalCount)]);

  yield call(extractUnitData, itemResponse.items);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count))]);
  yield put(setHiddenIsFetchingBooks(false));
}

function* unhideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);

  let bookIds;
  let queueIds;
  try {
    bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
    queueIds = yield call(requestUnhide, bookIds, revision);
  } catch (err) {
    let message = '';
    if (err instanceof UnhideError) {
      message = '숨김 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (err instanceof MakeBookIdsError) {
      message = '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
    yield put(showDialog('도서 숨김 해제 오류', message));
    return;
  }

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadItems);
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

function* deleteSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));

  let queueIds;
  try {
    queueIds = yield call(requestDelete, bookIds, revision);
  } catch (err) {
    yield put(showDialog('영구 삭제 오류', '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'));
    return;
  }

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadItems);
  }

  // TODO 메시지 수정
  yield all([put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.')), put(setFullScreenLoading(false))]);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(selectBooks(bookIds));
}

export default function* purchasedHiddenSaga() {
  yield all([
    takeEvery(LOAD_HIDDEN_ITEMS, loadItems),
    takeEvery(UNHIDE_SELECTED_HIDDEN_BOOKS, unhideSelectedBooks),
    takeEvery(DELETE_SELECTED_HIDDEN_BOOKS, deleteSelectedBooks),
    takeEvery(SELECT_ALL_HIDDEN_BOOKS, selectAllBooks),
  ]);
}

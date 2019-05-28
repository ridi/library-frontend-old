import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { loadBookData, loadUnitData } from '../../book/sagas';
import { MakeBookIdsError } from '../../common/errors';
import { getRevision, requestCheckQueueStatus, requestDelete, requestUnhide } from '../../common/requests';
import { getBookIdsByUnitIdsForHidden } from '../../common/sagas';
import { showDialog } from '../../dialog/actions';
import { getQuery } from '../../router/selectors';
import { selectBooks } from '../../selection/actions';
import { getSelectedBooks } from '../../selection/selectors';
import { showToast } from '../../toast/actions';
import { setError, setFullScreenLoading } from '../../ui/actions';
import {
  DELETE_SELECTED_HIDDEN_BOOKS,
  LOAD_HIDDEN_ITEMS,
  SELECT_ALL_HIDDEN_BOOKS,
  setHiddenIsFetchingBooks,
  setItems,
  setPage,
  setTotalCount,
  UNHIDE_SELECTED_HIDDEN_BOOKS,
} from './actions';
import { fetchHiddenItems, fetchHiddenItemsTotalCount } from './requests';
import { getItems, getItemsByPage, getOptions } from './selectors';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPage(page));
}

function* moveToFirstPage() {
  const query = yield select(getQuery);

  const linkProps = makeLinkProps({ pathname: URLMap.hidden.href }, URLMap.hidden.as, {
    ...query,
    page: 1,
  });

  Router.replace(linkProps.href, linkProps.as);
}

function* loadItems() {
  yield put(setError(false));
  yield call(persistPageOptionsFromQueries);

  const { page } = yield select(getOptions);

  try {
    yield put(setHiddenIsFetchingBooks(true));
    const [itemResponse, countResponse] = yield all([call(fetchHiddenItems, page), call(fetchHiddenItemsTotalCount)]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.unit_total_count) {
      yield moveToFirstPage();
      return;
    }

    // Request BookData
    yield all([call(loadBookData, toFlatten(itemResponse.items, 'b_id')), call(loadUnitData, toFlatten(itemResponse.items, 'unit_id'))]);

    yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count))]);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setHiddenIsFetchingBooks(false));
  }
}

function* unhideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);

  let queueIds;
  try {
    const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));
    queueIds = yield call(requestUnhide, bookIds, revision);
  } catch (err) {
    let message = '숨김 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    if (err instanceof MakeBookIdsError) {
      message = '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
    yield all([put(showDialog('도서 숨김 해제 오류', message)), put(setFullScreenLoading(false))]);
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
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIdsForHidden, items, Object.keys(selectedBooks));

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
  const bookIds = toFlatten(items.filter(item => !UnitType.isCollection(item.unit_type)), 'b_id');
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

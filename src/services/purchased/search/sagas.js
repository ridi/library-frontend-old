import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { loadBookData, loadUnitData } from '../../book/sagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { MakeBookIdsError } from '../../common/errors';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { showDialog } from '../../dialog/actions';
import { selectItems } from '../../selection/actions';
import { getSelectedItems } from '../../selection/selectors';
import { showToast } from '../../toast/actions';
import { setError, setFullScreenLoading } from '../../ui/actions';
import { loadRecentlyUpdatedData } from '../common/sagas/rootSagas';
import {
  DOWNLOAD_SELECTED_SEARCH_BOOKS,
  HIDE_SELECTED_SEARCH_BOOKS,
  LOAD_SEARCH_ITEMS,
  SELECT_ALL_SEARCH_BOOKS,
  setItems,
  setSearchIsFetchingBooks,
  setTotalCount,
} from './actions';
import { fetchSearchItems, fetchSearchItemsTotalCount } from './requests';
import { getItems, getItemsByPage } from './selectors';

function* loadPage(action) {
  yield put(setError(false));

  const { pageOptions } = action.payload;
  const { page, keyword } = pageOptions;

  if (!keyword) {
    return;
  }

  try {
    yield put(setSearchIsFetchingBooks(true));

    const [itemResponse, countResponse] = yield all([call(fetchSearchItems, keyword, page), call(fetchSearchItemsTotalCount, keyword)]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.unit_total_count) {
      return;
    }

    // Request BookData
    const bookIds = toFlatten(itemResponse.items, 'b_id');
    yield all([call(loadBookData, bookIds), call(loadUnitData, toFlatten(itemResponse.items, 'unit_id'))]);
    yield all([
      put(setItems(itemResponse.items, pageOptions)),
      put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count, pageOptions)),
    ]);

    yield fork(loadRecentlyUpdatedData, bookIds);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setSearchIsFetchingBooks(false));
  }
}

function* hideSelectedBooks(action) {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems, action.payload.pageOptions);
  const selectedBooks = yield select(getSelectedItems);

  let queueIds;
  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks));
    const revision = yield call(getRevision);
    queueIds = yield call(requestHide, bookIds, revision);
  } catch (err) {
    let message = '숨기기 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    if (err instanceof MakeBookIdsError) {
      message = '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    yield all([put(showDialog('도서 숨기기 오류', message)), put(setFullScreenLoading(false))]);
    return;
  }

  let isFinish = false;
  try {
    isFinish = yield call(requestCheckQueueStatus, queueIds);
  } catch (err) {
    isFinish = false;
  }

  if (isFinish) {
    yield call(loadPage, action);
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

function* downloadSelectedBooks(action) {
  const items = yield select(getItems, action.payload.pageOptions);
  const selectedBooks = yield select(getSelectedItems);

  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks));
    yield call(downloadBooks, bookIds);
  } catch (err) {
    let message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    if (err instanceof MakeBookIdsError) {
      message = '다운로드 대상 도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }
    yield put(showDialog('다운로드 오류', message));
  }
}

function* selectAllBooks(action) {
  const items = yield select(getItemsByPage, action.payload.pageOptions);
  const filteredItems = items.filter(item => !UnitType.isCollection(item.unit_type));
  const bookIds = toFlatten(filteredItems, 'b_id');
  yield put(selectItems(bookIds));
}

export default function* purchasedSearchRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_ITEMS, loadPage),
    takeEvery(HIDE_SELECTED_SEARCH_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_SEARCH_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_SEARCH_BOOKS, selectAllBooks),
  ]);
}

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
import { fetchPurchaseCategories } from '../filter/requests';
import { setFilterOptions } from '../filter/actions';
import {
  DOWNLOAD_SELECTED_MAIN_BOOKS,
  HIDE_SELECTED_MAIN_BOOKS,
  LOAD_MAIN_ITEMS,
  SELECT_ALL_MAIN_BOOKS,
  setIsFetchingBooks,
  updateItems,
} from './actions';
import { fetchMainItems, fetchMainItemsTotalCount } from './requests';
import { getItems, getItemsByPage } from './selectors';

function* loadMainItemsWithPageOptions(pageOptions) {
  // Clear Error
  yield put(setError(false));

  const { page: currentPage, orderType, orderBy, categoryFilter } = pageOptions;
  try {
    const [itemResponse, countResponse, categories] = yield all([
      call(fetchMainItems, orderType, orderBy, categoryFilter, currentPage),
      call(fetchMainItemsTotalCount, orderType, orderBy, categoryFilter),
      call(fetchPurchaseCategories),
    ]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.unit_total_count) {
      // 이대로 리턴하면 로딩 표시가 남는다
      return;
    }

    // Request BookData
    const bookIds = toFlatten(itemResponse.items, 'b_id');
    yield all([call(loadBookData, bookIds), call(loadUnitData, toFlatten(itemResponse.items, 'unit_id'))]);
    yield all([
      put(
        updateItems({
          pageOptions,
          items: itemResponse.items,
          unitTotalCount: countResponse.unit_total_count,
          itemTotalCount: countResponse.item_total_count,
        }),
      ),
      put(setFilterOptions(categories)),
    ]);
    yield fork(loadRecentlyUpdatedData, bookIds);
  } catch (err) {
    console.error(err);
    yield put(setError(true));
  }
  yield put(setIsFetchingBooks(false));
}

function* loadMainItems(action) {
  yield call(loadMainItemsWithPageOptions, action.payload.pageOptions);
}

function* hideSelectedBooks(action) {
  const { pageOptions } = action.payload;
  const { orderType, orderBy } = pageOptions;

  yield put(setFullScreenLoading(true));
  const items = yield select(getItems, pageOptions);
  const selectedBooks = yield select(getSelectedItems);

  let queueIds;
  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), orderType, orderBy);
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
    yield call(loadMainItemsWithPageOptions, pageOptions);
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
  const { pageOptions } = action.payload;
  const { orderType, orderBy } = pageOptions;

  const items = yield select(getItems, pageOptions);
  const selectedBooks = yield select(getSelectedItems);

  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), orderType, orderBy);
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
  const { pageOptions } = action.payload;
  const items = yield select(getItemsByPage, pageOptions);
  const filteredItems = items.filter(item => !UnitType.isCollection(item.unit_type));
  const bookIds = toFlatten(filteredItems, 'b_id');
  yield put(selectItems(bookIds));
}

export default function* purchaseMainRootSaga() {
  yield all([
    takeEvery(LOAD_MAIN_ITEMS, loadMainItems),
    takeEvery(HIDE_SELECTED_MAIN_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_MAIN_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_MAIN_BOOKS, selectAllBooks),
  ]);
}

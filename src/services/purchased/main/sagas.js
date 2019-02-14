import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  DOWNLOAD_SELECTED_MAIN_BOOKS,
  HIDE_SELECTED_MAIN_BOOKS,
  LOAD_MAIN_ITEMS,
  SELECT_ALL_MAIN_BOOKS,
  setFilter,
  setFilterOptions,
  setItems,
  setOrder,
  setPage,
  setTotalCount,
  selectBooks,
  setIsFetchingBooks,
} from './actions';
import { showToast } from '../../toast/actions';
import { fetchMainItems, fetchMainItemsTotalCount, fetchPurchaseCategories } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';
import { toFlatten } from '../../../utils/array';

import { getQuery } from '../../router/selectors';
import { getItems, getItemsByPage, getOptions, getSelectedBooks } from './selectors';

import { loadBookData, extractUnitData } from '../../book/sagas';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { setFullScreenLoading } from '../../fullScreenLoading/actions';
import { makeLinkProps } from '../../../utils/uri';
import { URLMap } from '../../../constants/urls';
import { HideError, MakeBookIdsError } from '../../common/errors';
import { showDialog } from '../../dialog/actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = MainOrderOptions.DEFAULT.orderType, order_by: orderBy = MainOrderOptions.DEFAULT.orderBy } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);
  const filter = parseInt(query.filter, 10) || null;

  yield all([put(setPage(page)), put(setOrder(order)), put(setFilter(filter))]);
}

function* loadMainItems() {
  yield call(persistPageOptionsFromQueries);

  const { page, order, filter: category } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  yield put(setIsFetchingBooks(true));
  const [itemResponse, countResponse, categories] = yield all([
    call(fetchMainItems, orderType, orderBy, category, page),
    call(fetchMainItemsTotalCount, orderType, orderBy, category),
    call(fetchPurchaseCategories),
  ]);

  yield call(extractUnitData, itemResponse.items);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([
    put(setItems(itemResponse.items)),
    put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setFilterOptions(categories)),
  ]);
  yield put(setIsFetchingBooks(false));
}

function* hideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const { order } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

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
    yield put(showDialog('도서 숨기기 오류', message));
    return;
  }

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadMainItems);
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
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const { order } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);
  const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), orderType, orderBy);

  yield call(downloadBooks, bookIds);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(selectBooks(bookIds));
}

export default function* purchaseMainRootSaga() {
  yield all([
    takeEvery(LOAD_MAIN_ITEMS, loadMainItems),
    takeEvery(HIDE_SELECTED_MAIN_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_MAIN_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_MAIN_BOOKS, selectAllBooks),
  ]);
}

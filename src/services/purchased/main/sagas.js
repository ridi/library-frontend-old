import Router from 'next/router';
import { all, fork, call, put, select, takeEvery } from 'redux-saga/effects';

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

import { OrderOptions } from '../../../constants/orderOptions';
import { toFlatten } from '../../../utils/array';

import { getQuery } from '../../router/selectors';
import { getItems, getItemsByPage, getOptions, getSelectedBooks } from './selectors';

import { loadBookData, loadUnitData } from '../../book/sagas';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { loadRecentlyUpdatedData } from '../common/sagas/rootSagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { setFullScreenLoading, setError } from '../../ui/actions';
import { makeLinkProps } from '../../../utils/uri';
import { URLMap } from '../../../constants/urls';
import { MakeBookIdsError } from '../../common/errors';
import { showDialog } from '../../dialog/actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = OrderOptions.DEFAULT.orderType, order_by: orderBy = OrderOptions.DEFAULT.orderBy } = query;
  const order = OrderOptions.toKey(orderType, orderBy);
  const filter = parseInt(query.filter, 10) || null;

  yield all([put(setPage(page)), put(setOrder(order)), put(setFilter(filter))]);
}

function* moveToFirstPage() {
  const query = yield select(getQuery);

  const linkProps = makeLinkProps({ pathname: URLMap.main.href }, URLMap.main.as, {
    ...query,
    page: 1,
  });

  Router.replace(linkProps.href, linkProps.as);
}

function* loadMainItems() {
  // Clear Error
  yield put(setError(false));
  yield call(persistPageOptionsFromQueries);

  const { page, order, filter: category } = yield select(getOptions);
  const { orderType, orderBy } = OrderOptions.parse(order);

  try {
    yield put(setIsFetchingBooks(true));
    const [itemResponse, countResponse, categories] = yield all([
      call(fetchMainItems, orderType, orderBy, category, page),
      call(fetchMainItemsTotalCount, orderType, orderBy, category),
      call(fetchPurchaseCategories),
    ]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.unit_total_count) {
      yield moveToFirstPage();
      return;
    }

    // Request BookData
    const bookIds = toFlatten(itemResponse.items, 'b_id');
    yield all([
      call(loadBookData, bookIds),
      call(loadUnitData, toFlatten(itemResponse.items, 'unit_id')),
      fork(loadRecentlyUpdatedData, bookIds),
    ]);

    yield all([
      put(setItems(itemResponse.items)),
      put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
      put(setFilterOptions(categories)),
    ]);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setIsFetchingBooks(false));
  }
}

function* hideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const { order } = yield select(getOptions);
  const { orderType, orderBy } = OrderOptions.parse(order);

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
  const { orderType, orderBy } = OrderOptions.parse(order);

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

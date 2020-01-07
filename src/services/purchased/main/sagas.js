import { all, call, fork, join, put, select, takeEvery } from 'redux-saga/effects';

import { getDeletedBookIds } from 'services/book/selectors';
import { selectionActions } from 'services/selection/reducers';

import { BooksPageKind, URLMap } from '../../../constants/urls';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { loadBookData, loadUnitData } from '../../book/sagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { MakeBookIdsError } from '../../common/errors';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { showDialog } from '../../dialog/actions';
import { getSelectedItems } from '../../selection/selectors';
import { showToast } from '../../toast/actions';
import { setError, setFullScreenLoading } from '../../ui/actions';
import { loadRecentlyUpdatedData } from '../common/sagas/rootSagas';
import { updateCategories, updateServiceTypes } from '../filter/sagas';
import { DOWNLOAD_SELECTED_MAIN_BOOKS, HIDE_SELECTED_MAIN_BOOKS, LOAD_MAIN_ITEMS, SELECT_ALL_MAIN_BOOKS, updateItems } from './actions';
import { fetchMainItems, fetchMainItemsTotalCount } from './requests';
import { getItems, getItemsByPage } from './selectors';

const removeDeletedBook = (items, deletedBookIds) => items.filter(item => !deletedBookIds.includes(item.b_id));

function* loadMainItems(action) {
  yield put(setError(false));

  const { pageOptions } = action.payload;

  let categoryTask;
  if (pageOptions.kind === BooksPageKind.MAIN) {
    categoryTask = yield all([fork(updateCategories), fork(updateServiceTypes)]);
  }

  try {
    const [itemResponse, countResponse] = yield all([call(fetchMainItems, pageOptions), call(fetchMainItemsTotalCount, pageOptions)]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.unit_total_count) {
      // 이대로 리턴하면 로딩 표시가 남는다
      return;
    }

    // Request BookData
    const bookIds = toFlatten(itemResponse.items, 'b_id');
    yield all([call(loadBookData, bookIds), call(loadUnitData, toFlatten(itemResponse.items, 'unit_id'))]);
    const deletedBookIds = yield select(getDeletedBookIds, bookIds);
    const items = removeDeletedBook(itemResponse.items, deletedBookIds);

    yield put(
      updateItems({
        pageOptions,
        items,
        unitTotalCount: countResponse.unit_total_count,
        itemTotalCount: countResponse.item_total_count,
      }),
    );
    yield fork(loadRecentlyUpdatedData, bookIds);
    if (categoryTask != null) {
      yield join(categoryTask);
    }
  } catch (err) {
    console.error(err);
    yield put(setError(true));
  }
}

function* hideSelectedBooks(action) {
  const { pageOptions } = action.payload;

  yield put(setFullScreenLoading(true));
  const items = yield select(getItems, pageOptions);
  const selectedBooks = yield select(getSelectedItems);

  let queueIds;
  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), pageOptions);
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
    yield call(loadMainItems, action);
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

  const items = yield select(getItems, pageOptions);
  const selectedBooks = yield select(getSelectedItems);

  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), pageOptions);
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
  const bookIds = toFlatten(items, 'b_id');
  yield put(selectionActions.selectItems(bookIds));
}

export default function* purchaseMainRootSaga() {
  yield all([
    takeEvery(LOAD_MAIN_ITEMS, loadMainItems),
    takeEvery(HIDE_SELECTED_MAIN_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_MAIN_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_MAIN_BOOKS, selectAllBooks),
  ]);
}

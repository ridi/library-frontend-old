import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { toFlatten } from '../../utils/array';

import { loadBookData } from '../book/sagas';
import { showDialog } from '../dialog/actions';
import { setIsFetchingHiddenBook } from '../purchased/hiddenUnit/actions';

import { getQuery } from '../router/selectors';
import { showToast } from '../toast/actions';
import { setError, setFullScreenLoading } from '../ui/actions';

import {
  DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS,
  LOAD_SERIAL_PREFERENCE_ITEMS,
  SELECT_ALL_SERIAL_PREFERENCE_BOOKS,
  selectBooks,
  setIsFetchingBooks,
  setItems,
  setPage,
  setTotalCount,
} from './actions';
import { deleteSerialPreferenceItems, fetchSerialPreferenceItems } from './requests';
import { getItemsByPage, getOptions, getSelectedBooks } from './selectors';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  yield all([put(setPage(page))]);
}

function* loadItems() {
  yield call(persistPageOptionsFromQueries);

  const { page } = yield select(getOptions);

  try {
    yield put(setIsFetchingBooks(true));
    const itemResponse = yield call(fetchSerialPreferenceItems, page);

    // Request BookData
    const bookIds = [...toFlatten(itemResponse.items, 'series_id'), ...toFlatten(itemResponse.items, 'recent_read_b_id')];
    yield call(loadBookData, bookIds);
    yield all([put(setItems(itemResponse.items)), put(setTotalCount(itemResponse.book_count))]);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setIsFetchingHiddenBook(false));
  }
}

function* deleteSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedBooks);
  const bookSeriesIds = Object.keys(selectedBooks);

  try {
    yield call(deleteSerialPreferenceItems, bookSeriesIds);
  } catch (err) {
    yield put(showDialog('선호작품 삭제 오류', '선호작품 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'));
    return;
  } finally {
    yield put(setFullScreenLoading(false));
  }

  yield all([put(showToast('선호작품에서 삭제되었습니다.')), call(loadItems)]);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'series_id');
  yield put(selectBooks(bookIds));
}

export default function* serialPreferenceRootSaga() {
  yield all([
    takeEvery(LOAD_SERIAL_PREFERENCE_ITEMS, loadItems),
    takeEvery(DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS, deleteSelectedBooks),
    takeEvery(SELECT_ALL_SERIAL_PREFERENCE_BOOKS, selectAllBooks),
  ]);
}

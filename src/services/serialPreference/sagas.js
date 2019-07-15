import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { toFlatten } from '../../utils/array';
import { fetchUnitIdMap } from '../book/requests';
import { loadBookData } from '../book/sagas';
import { showDialog } from '../dialog/actions';
import { selectItems } from '../selection/actions';
import { getSelectedItems } from '../selection/selectors';
import { showToast } from '../toast/actions';
import { setError, setFullScreenLoading } from '../ui/actions';
import {
  DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS,
  LOAD_SERIAL_PREFERENCE_ITEMS,
  SELECT_ALL_SERIAL_PREFERENCE_BOOKS,
  setIsFetchingBooks,
  setItems,
  setSerialUnitIdMap,
  setTotalCount,
} from './actions';
import { deleteSerialPreferenceItems, fetchSerialPreferenceItems } from './requests';
import { getItemsByPage, getOptions } from './selectors';

function* loadItems() {
  yield put(setError(false));

  const { page } = yield select(getOptions);

  try {
    yield put(setIsFetchingBooks(true));
    const itemResponse = yield call(fetchSerialPreferenceItems, page);

    if (itemResponse.items.length !== 0) {
      const seriesBookIds = toFlatten(itemResponse.items, 'series_id');
      const unitIdMapResponse = yield call(fetchUnitIdMap, seriesBookIds);
      // Request BookData
      const bookIds = [...seriesBookIds, ...toFlatten(itemResponse.items, 'recent_read_b_id')];
      yield call(loadBookData, bookIds);
      yield put(setSerialUnitIdMap(unitIdMapResponse.result));
    }

    yield all([put(setItems(itemResponse.items)), put(setTotalCount(itemResponse.book_count))]);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setIsFetchingBooks(false));
  }
}

function* deleteSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const selectedBooks = yield select(getSelectedItems);
  const bookSeriesIds = Object.keys(selectedBooks);

  try {
    yield call(deleteSerialPreferenceItems, bookSeriesIds);
  } catch (err) {
    yield put(showDialog('선호작품 삭제 오류', '선호작품 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'));
    return;
  } finally {
    yield put(setFullScreenLoading(false));
  }

  yield all([put(showToast({ message: '선호작품에서 삭제되었습니다.' })), call(loadItems)]);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'series_id');
  yield put(selectItems(bookIds));
}

export default function* serialPreferenceRootSaga() {
  yield all([
    takeEvery(LOAD_SERIAL_PREFERENCE_ITEMS, loadItems),
    takeEvery(DELETE_SELECTED_SERIAL_PREFERENCE_BOOKS, deleteSelectedBooks),
    takeEvery(SELECT_ALL_SERIAL_PREFERENCE_BOOKS, selectAllBooks),
  ]);
}

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
import { getItemsByPage } from './selectors';

function* loadItems(action) {
  const { page } = action.payload;
  yield put(setError(false));
  try {
    yield put(setIsFetchingBooks(true));
    const itemResponse = yield call(fetchSerialPreferenceItems, page);

    if (itemResponse.items.length !== 0) {
      const seriesBookIds = toFlatten(itemResponse.items, 'series_id');
      const bookIds = [...seriesBookIds, ...toFlatten(itemResponse.items, 'recent_read_b_id')];
      const [unitIdMapResponse] = yield all([call(fetchUnitIdMap, seriesBookIds), call(loadBookData, bookIds)]);
      yield put(setSerialUnitIdMap(unitIdMapResponse.result));
    }
    yield all([put(setItems(itemResponse.items, page)), put(setTotalCount(itemResponse.book_count))]);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setIsFetchingBooks(false));
  }
}

function* deleteSelectedBooks(action) {
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

  yield all([put(showToast({ message: '선호작품에서 삭제되었습니다.' })), call(loadItems, action)]);
}

function* selectAllBooks(action) {
  const items = yield select(getItemsByPage, action.payload.page);
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

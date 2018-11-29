import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
  LOAD_PURCHASED_HIDDEN_ITEMS,
  setPurchasedHiddenItems,
  setPurchasedHiddenPage,
  setPurchasedHiddenTotalCount,
  SHOW_SELECTED_BOOKS,
  DELETE_SELECTED_BOOKS,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData } from '../../book/sagas';
import { fetchPurchasedHiddenItems, fetchPurchasedHiddenItemsTotalCount } from './requests';
import { toFlatten } from '../../../utils/array';
import { getHiddenItems, getSelectedHiddenBooks } from './selectors';

import { getRevision, requestShow } from '../../common/requests';
import { getBookIdsByUnitIds } from '../../common/sagas';

function* loadPurchasedHiddenItems() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPurchasedHiddenPage(page));

  const [itemResponse, countResponse] = yield all([call(fetchPurchasedHiddenItems, page), call(fetchPurchasedHiddenItemsTotalCount)]);
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([put(setPurchasedHiddenItems(itemResponse.items)), put(setPurchasedHiddenTotalCount(countResponse.item_total_count))]);
}

function* showSelectedBooks() {
  const items = yield select(getHiddenItems);
  const selectedBooks = yield select(getSelectedHiddenBooks);

  const revision = yield call(getRevision);
  const bookIds = yield call(getBookIdsByUnitIds, items, Object.keys(selectedBooks));
  const queueIds = yield call(requestShow, bookIds, revision);

  // TODO: Check Queue Status
  yield call(delay, 3000); // Temporary Sleep

  yield call(loadPurchasedHiddenItems);
}

function* deleteSelectedBooks() {
  console.log('deleteSelectedBooks');
}

export default function* purchasedHiddenSaga() {
  yield all([
    takeEvery(LOAD_PURCHASED_HIDDEN_ITEMS, loadPurchasedHiddenItems),
    takeEvery(SHOW_SELECTED_BOOKS, showSelectedBooks),
    takeEvery(DELETE_SELECTED_BOOKS, deleteSelectedBooks),
  ]);
}

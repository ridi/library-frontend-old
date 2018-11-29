import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASED_HIDDEN_ITEMS,
  setPurchasedHiddenItems,
  setPurchasedHiddenPage,
  setPurchasedHiddenTotalCount,
  UNHIDE_SELECTED_BOOKS,
  DELETE_SELECTED_BOOKS,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData } from '../../book/sagas';
import { fetchPurchasedHiddenItems, fetchPurchasedHiddenItemsTotalCount } from './requests';
import { toFlatten } from '../../../utils/array';

function* loadPurchasedHiddenItems() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPurchasedHiddenPage(page));

  const [itemResponse, countResponse] = yield all([call(fetchPurchasedHiddenItems, page), call(fetchPurchasedHiddenItemsTotalCount)]);
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([put(setPurchasedHiddenItems(itemResponse.items)), put(setPurchasedHiddenTotalCount(countResponse.item_total_count))]);
}

function* unhideSelectedBooks() {
  console.log('unhide');
}
function* deleteSelectedBooks() {
  console.log('deleteSelectedBooks');
}

export default function* purchasedHiddenSaga() {
  yield all([
    takeEvery(LOAD_PURCHASED_HIDDEN_ITEMS, loadPurchasedHiddenItems),
    takeEvery(UNHIDE_SELECTED_BOOKS, unhideSelectedBooks),
    takeEvery(DELETE_SELECTED_BOOKS, deleteSelectedBooks),
  ]);
}

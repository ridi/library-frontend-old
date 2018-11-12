import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASED_HIDDEN_ITEMS,
  setPurchasedHiddenItems,
  setPurchasedHiddenPage,
  setPurchasedHiddenTotalCount,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData } from '../../book/sagas';
import { fetchPurchasedHiddenItems, fetchPurchasedHiddenItemsTotalCount } from './requests';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* loadPurchasedHiddenItems() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPurchasedHiddenPage(page));

  const [itemResponse, countResponse] = yield all([
    call(fetchPurchasedHiddenItems, page),
    call(fetchPurchasedHiddenItemsTotalCount),
  ]);
  const bookIds = getBookIdsFromItems(itemResponse.items);
  yield call(loadBookData, bookIds);
  yield all([
    put(setPurchasedHiddenItems(itemResponse.items)),
    put(setPurchasedHiddenTotalCount(countResponse.item_total_count)),
  ]);
}

export default function* purchasedHiddenSaga() {
  yield takeEvery(LOAD_PURCHASED_HIDDEN_ITEMS, loadPurchasedHiddenItems);
}

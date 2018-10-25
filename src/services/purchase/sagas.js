import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_ITEMS,
  setPurchaseItems,
  setPurchaseTotalCount,
} from './actions';
import { fetchPurchaseItems, fetchPurchaseItemsTotalCount } from './requests';

import { loadBookData } from '../book/actions';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* loadPurchaseItems() {
  const page = yield select(state => state.purchase.page);
  const { orderType, orderBy, category } = yield select(
    state => state.purchase.options,
  );

  const [itemResponse, countResponse] = yield all([
    call(fetchPurchaseItems(orderType, orderBy, category, page)),
    call(fetchPurchaseItemsTotalCount(orderType, orderBy, category)),
  ]);
  const bookIds = getBookIdsFromItems(itemResponse.items);

  yield put(loadBookData(bookIds));
  yield put(setPurchaseItems(itemResponse.items));
  yield put(
    setPurchaseTotalCount(
      countResponse.unit_total_count,
      countResponse.item_total_count,
    ),
  );
}

export default function* showsRootSaga() {
  yield all([takeEvery(LOAD_PURCHASE_ITEMS, loadPurchaseItems)]);
}

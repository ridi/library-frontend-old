import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_ITEMS,
  setPurchaseItems,
  setPurchaseTotalCount,
  setPurchasePage,
  setPurchaseOrder,
} from './actions';
import { fetchPurchaseItems, fetchPurchaseItemsTotalCount } from './requests';

import { mainOrderOptions } from '../../constants/orderOptions';

import { loadBookData } from '../book/sagas';
import { getQueries } from '../router/selectors';
import { getOrderOption } from './selectors';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* persistPageOptionsFromQuries() {
  const queries = yield select(getQueries);
  const page = parseInt(queries.page, 10) || 1;
  const order = queries.order || mainOrderOptions[0].value;
  yield all([put(setPurchasePage(page)), put(setPurchaseOrder(order))]);
}

function* loadPurchaseItems() {
  yield call(persistPageOptionsFromQuries);

  const page = yield select(state => state.purchase.page);
  const { orderType, orderBy } = yield select(getOrderOption);
  const category = null;

  const [itemResponse, countResponse] = yield all([
    call(fetchPurchaseItems, orderType, orderBy, category, page),
    call(fetchPurchaseItemsTotalCount, orderType, orderBy, category),
  ]);

  // Request BookData
  const bookIds = getBookIdsFromItems(itemResponse.items);
  yield call(loadBookData, bookIds);

  yield put(setPurchaseItems(itemResponse.items));
  yield put(
    setPurchaseTotalCount(
      countResponse.unit_total_count,
      countResponse.item_total_count,
    ),
  );
}

function* changeOrder() {
  // Step 1. Get Options (filter, order, page=1)
  // Step 2. reload
}

export default function* purchaseRootSaga() {
  yield all([takeEvery(LOAD_PURCHASE_ITEMS, loadPurchaseItems)]);
}

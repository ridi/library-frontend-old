import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_ITEMS,
  setPurchaseItems,
  setPurchaseTotalCount,
  setPurchasePage,
  setPurchaseOrder,
} from './actions';
import { fetchPurchaseItems, fetchPurchaseItemsTotalCount } from './requests';

import { MainOrderOptions } from '../../constants/orderOptions';

import { loadBookData } from '../book/sagas';
import { getQueries } from '../router/selectors';
import { getPurchaseOptions } from './selectors';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* persistPageOptionsFromQuries() {
  const queries = yield select(getQueries);
  const page = parseInt(queries.page, 10) || 1;
  const order = queries.order || MainOrderOptions.DEFAULT;
  yield all([put(setPurchasePage(page)), put(setPurchaseOrder(order))]);
}

function* loadPurchaseItems() {
  yield call(persistPageOptionsFromQuries);

  const page = yield select(state => state.purchase.page);

  const { order, category } = yield select(getPurchaseOptions);
  const { orderBy, orderType } = MainOrderOptions.parse(order);
  console.log(MainOrderOptions.toList());

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
export default function* purchaseRootSaga() {
  yield all([takeEvery(LOAD_PURCHASE_ITEMS, loadPurchaseItems)]);
}

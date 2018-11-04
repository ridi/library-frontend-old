import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_ITEMS,
  CHANGE_PURCHASE_ORDER,
  setPurchaseItems,
  setPurchaseTotalCount,
  setPurchasePage,
  setPurchaseOrder,
} from './actions';
import { fetchPurchaseItems, fetchPurchaseItemsTotalCount } from './requests';

import { MainOrderOptions } from '../../constants/orderOptions';

import { loadBookData } from '../book/sagas';
import { getQuery } from '../router/selectors';
import { getPurchaseOptions } from './selectors';
import { makeURI } from '../../utils/uri';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* persistPageOptionsFromQuries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  const order = query.order || MainOrderOptions.DEFAULT;
  yield all([put(setPurchasePage(page)), put(setPurchaseOrder(order))]);
}

function* loadPurchaseItems() {
  yield call(persistPageOptionsFromQuries);

  const { page, order, filter: category } = yield select(getPurchaseOptions);
  const { orderBy, orderType } = MainOrderOptions.parse(order);

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

function* changePurchaseOrder(action) {
  const { page, filter } = yield select(getPurchaseOptions);
  const query = {
    page,
    order: action.payload.order,
    filter,
  };
  Router.push(makeURI('/', query));
}

export default function* purchaseRootSaga() {
  yield all([
    takeEvery(LOAD_PURCHASE_ITEMS, loadPurchaseItems),
    takeEvery(CHANGE_PURCHASE_ORDER, changePurchaseOrder),
  ]);
}

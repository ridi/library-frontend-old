import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASED_UNIT_ITEMS,
  CHANGE_PURCHASED_UNIT_OPTION,
  setPurchasedUnitItems,
  setPurchasedUnitTotalCount,
  setPurchasedUnitPage,
  setPurchasedUnitOrder,
  setPurchasedUnitFilter,
  setPurchasedUnitFilterOptions,
} from './actions';
import { fetchPurchasedUnitItems, fetchPurchasedUnitItemsTotalCount } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';

import { loadBookData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getPurchasedUnitOptions, getUnitId } from './selectors';
import { makeURI } from '../../../utils/uri';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* persistPageOptionsFromQuries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = MainOrderOptions.DEFAULT.order_type, order_by: orderBy = MainOrderOptions.DEFAULT.order_by } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);
  const filter = query.filter || '';

  yield all([put(setPurchasedUnitPage(page)), put(setPurchasedUnitOrder(order)), put(setPurchasedUnitFilter(filter))]);
}

function* loadPurchaseUnitItems() {
  yield call(persistPageOptionsFromQuries);

  const { page, order, filter: category } = yield select(getPurchasedUnitOptions);
  const unitId = yield select(getUnitId);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  const [itemResponse, countResponse, categories] = yield all([
    call(fetchPurchasedUnitItems, unitId, orderType, orderBy, category, page),
    call(fetchPurchasedUnitItemsTotalCount, unitId, orderType, orderBy, category),
  ]);

  // Request BookData
  const bookIds = getBookIdsFromItems(itemResponse.items);
  yield call(loadBookData, bookIds);

  yield all([
    put(setPurchasedUnitItems(itemResponse.items)),
    put(setPurchasedUnitTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setPurchasedUnitFilterOptions(categories)),
  ]);
}

function* changePurchasedUnitOption(action) {
  const { page, order, filter } = yield select(getPurchasedUnitOptions);

  let { orderBy, orderType } = MainOrderOptions.parse(order);
  let _filter = filter;

  if (action.payload.key === 'order') {
    ({ orderBy, orderType } = MainOrderOptions.parse(action.payload.value));
  } else if (action.payload.key === 'filter') {
    _filter = action.payload.value;
  }

  const query = {
    page,
    orderBy,
    orderType,
    filter: _filter,
  };

  Router.push(makeURI('/', query));
}

export default function* purchaseRootSaga() {
  yield all([
    takeEvery(LOAD_PURCHASED_UNIT_ITEMS, loadPurchaseUnitItems),
    takeEvery(CHANGE_PURCHASED_UNIT_OPTION, changePurchasedUnitOption),
  ]);
}

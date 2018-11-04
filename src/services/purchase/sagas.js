import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_ITEMS,
  CHANGE_PURCHASE_OPTION,
  setPurchaseItems,
  setPurchaseTotalCount,
  setPurchasePage,
  setPurchaseOrder,
  setPurchaseFilter,
  setPurchaseFilterOptions,
} from './actions';
import {
  fetchPurchaseItems,
  fetchPurchaseItemsTotalCount,
  fetchPurchaseCategories,
} from './requests';

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
  const filter = query.filter || '';
  yield all([
    put(setPurchasePage(page)),
    put(setPurchaseOrder(order)),
    put(setPurchaseFilter(filter)),
  ]);
}

function* loadPurchaseItems() {
  yield call(persistPageOptionsFromQuries);

  const { page, order, filter: category } = yield select(getPurchaseOptions);
  const { orderBy, orderType } = MainOrderOptions.parse(order);

  const [itemResponse, countResponse, categories] = yield all([
    call(fetchPurchaseItems, orderType, orderBy, category, page),
    call(fetchPurchaseItemsTotalCount, orderType, orderBy, category),
    call(fetchPurchaseCategories),
  ]);

  // Request BookData
  const bookIds = getBookIdsFromItems(itemResponse.items);
  yield call(loadBookData, bookIds);

  yield all([
    put(setPurchaseItems(itemResponse.items)),
    put(
      setPurchaseTotalCount(
        countResponse.unit_total_count,
        countResponse.item_total_count,
      ),
    ),
    put(setPurchaseFilterOptions(categories)),
  ]);
}

function* changePurchaseOption(action) {
  const { page, order, filter } = yield select(getPurchaseOptions);
  const query = {
    page,
    order,
    filter,
    [action.payload.key]: action.payload.value,
  };
  console.log(query);
  console.log(makeURI('/', query));
  Router.push(makeURI('/', query));
}

export default function* purchaseRootSaga() {
  yield all([
    takeEvery(LOAD_PURCHASE_ITEMS, loadPurchaseItems),
    takeEvery(CHANGE_PURCHASE_OPTION, changePurchaseOption),
  ]);
}

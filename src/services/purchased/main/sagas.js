import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_ITEMS,
  CHANGE_PURCHASE_OPTION,
  HIDE_SELECTED_BOOKS,
  DOWNLOAD_SELECTED_BOOKS,
  setPurchaseItems,
  setPurchaseTotalCount,
  setPurchasePage,
  setPurchaseOrder,
  setPurchaseFilter,
  setPurchaseFilterOptions,
} from './actions';
import { fetchPurchaseItems, fetchPurchaseItemsTotalCount, fetchPurchaseCategories, requestHide, requestDownload } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';

import { loadBookData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getPurchaseOptions, getSelectedBooks } from './selectors';
import { makeURI } from '../../../utils/uri';
import { toFlatten } from '../../../utils/array';
import { URLMap } from '../../../constants/urls';

import { getRevision, getSyncStatus } from '../../common/requests';

function* persistPageOptionsFromQuries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = MainOrderOptions.DEFAULT.order_type, order_by: orderBy = MainOrderOptions.DEFAULT.order_by } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);
  const filter = parseInt(query.filter, 10) || null;

  yield all([put(setPurchasePage(page)), put(setPurchaseOrder(order)), put(setPurchaseFilter(filter))]);
}

function* loadPurchaseItems() {
  yield call(persistPageOptionsFromQuries);

  const { page, order, filter: category } = yield select(getPurchaseOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  const [itemResponse, countResponse, categories] = yield all([
    call(fetchPurchaseItems, orderType, orderBy, category, page),
    call(fetchPurchaseItemsTotalCount, orderType, orderBy, category),
    call(fetchPurchaseCategories),
  ]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);

  yield all([
    put(setPurchaseItems(itemResponse.items)),
    put(setPurchaseTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setPurchaseFilterOptions(categories)),
  ]);
}

function* changePurchaseOption(action) {
  const { page, order, filter } = yield select(getPurchaseOptions);
  let { orderBy, orderType } = MainOrderOptions.parse(order);
  let _filter = filter;
  let _page = page;

  if (action.payload.key === 'order') {
    ({ orderBy, orderType } = MainOrderOptions.parse(action.payload.value));
  } else if (action.payload.key === 'filter') {
    _filter = action.payload.value;
  } else if (action.payload.key === 'page') {
    _page = action.payload.value;
  }

  const query = {
    page: _page,
    orderBy,
    orderType,
    filter: _filter,
  };

  const { href, as } = URLMap.main;
  Router.push(makeURI(href, query), makeURI(as, query));
}

function* hideSelectedBooks() {
  const selectedBooks = yield select(getSelectedBooks);
  const selectedBookIds = Object.keys(selectedBooks);

  // TODO: Get Book Ids

  const revision = yield call(getRevision);
  const queueIds = yield call(requestHide, selectedBookIds, revision);

  // TODO: Check Queue Status

  yield call(loadPurchaseItems);
}

function* downloadSelectedBooks() {
  console.log('downloadSelectedBooks');
}

export default function* purchaseMainRootSaga() {
  yield all([
    takeEvery(LOAD_PURCHASE_ITEMS, loadPurchaseItems),
    takeEvery(CHANGE_PURCHASE_OPTION, changePurchaseOption),
    takeEvery(HIDE_SELECTED_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_BOOKS, downloadSelectedBooks),
  ]);
}

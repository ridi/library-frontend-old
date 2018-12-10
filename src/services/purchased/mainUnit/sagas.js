import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_MAIN_UNIT_ITEMS,
  CHANGE_MAIN_UNIT_OPTION,
  setMainUnitItems,
  setMainUnitTotalCount,
  setMainUnitPage,
  setMainUnitOrder,
  setMainUnitFilter,
  setMainUnitFilterOptions,
} from './actions';
import { fetchMainUnitItems, fetchMainUnitItemsTotalCount } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';

import { loadBookData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getMainUnitOptions, getUnitId } from './selectors';
import { makeURI } from '../../../utils/uri';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* persistPageOptionsFromQuries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = MainOrderOptions.DEFAULT.order_type, order_by: orderBy = MainOrderOptions.DEFAULT.order_by } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);
  const filter = query.filter || '';

  yield all([put(setMainUnitPage(page)), put(setMainUnitOrder(order)), put(setMainUnitFilter(filter))]);
}

function* loadMainUnitItems() {
  yield call(persistPageOptionsFromQuries);

  const { page, order, filter: category } = yield select(getMainUnitOptions);
  const unitId = yield select(getUnitId);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  const [itemResponse, countResponse, categories] = yield all([
    call(fetchMainUnitItems, unitId, orderType, orderBy, category, page),
    call(fetchMainUnitItemsTotalCount, unitId, orderType, orderBy, category),
  ]);

  // Request BookData
  const bookIds = getBookIdsFromItems(itemResponse.items);
  yield call(loadBookData, bookIds);

  yield all([
    put(setMainUnitItems(itemResponse.items)),
    put(setMainUnitTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setMainUnitFilterOptions(categories)),
  ]);
}

function* changeMainUnitOption(action) {
  const { unitId, page, order, filter } = yield select(getMainUnitOptions);

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

  Router.push(makeURI(`/purchased/${unitId}`, query));
}

export default function* purchaseRootSaga() {
  yield all([takeEvery(LOAD_MAIN_UNIT_ITEMS, loadMainUnitItems), takeEvery(CHANGE_MAIN_UNIT_OPTION, changeMainUnitOption)]);
}

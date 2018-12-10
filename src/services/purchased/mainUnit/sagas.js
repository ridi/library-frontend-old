import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_MAIN_UNIT_ITEMS,
  setMainUnitFilter,
  setMainUnitFilterOptions,
  setMainUnitItems,
  setMainUnitOrder,
  setMainUnitPage,
  setMainUnitTotalCount,
} from './actions';
import { fetchMainUnitItems, fetchMainUnitItemsTotalCount } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';

import { loadBookData } from '../../book/sagas';
import { getQuery } from '../../router/selectors';
import { getMainUnitOptions, getUnitId } from './selectors';

import { toFlatten } from '../../../utils/array';

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

  const unitId = yield select(getUnitId);
  const { page, order, filter: category } = yield select(getMainUnitOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  const [itemResponse, countResponse, categories] = yield all([
    call(fetchMainUnitItems, unitId, orderType, orderBy, category, page),
    call(fetchMainUnitItemsTotalCount, unitId, orderType, orderBy, category),
  ]);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);

  yield all([
    put(setMainUnitItems(itemResponse.items)),
    put(setMainUnitTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setMainUnitFilterOptions(categories)),
  ]);
}

export default function* purchaseRootSaga() {
  yield all([takeEvery(LOAD_MAIN_UNIT_ITEMS, loadMainUnitItems)]);
}

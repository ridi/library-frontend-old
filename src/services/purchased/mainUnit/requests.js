import { put } from 'redux-saga/effects';

import config from '../../../config';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';

import { OrderType, OrderOptions } from '../../../constants/orderOptions';
import { attatchTTL } from '../../../utils/ttl';

export function* fetchMainUnitItems(unitId, orderType, orderBy, page) {
  const options = {
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
    options.expiredBooksOnly = true;
  } else {
    options.orderType = orderType;
    options.orderBy = orderBy;
  }

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/main/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchMainUnitItemsTotalCount(unitId, orderType, orderBy) {
  const options = {};

  if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
    options.expiredBooksOnly = true;
  } else {
    options.orderType = orderType;
    options.orderBy = orderBy;
  }

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/main/${unitId}/count`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* getMainUnitPrimaryItem(unitId) {
  const options = {
    orderType: OrderOptions.PURCHASE_DATE.orderType,
    orderBy: OrderOptions.PURCHASE_DATE.orderBy,
    offset: 0,
    limit: 1,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/main/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return attatchTTL(response.data.items)[0];
}

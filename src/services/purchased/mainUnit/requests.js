import { put } from 'redux-saga/effects';

import config from '../../../config';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';

import { MainOrderOptions } from '../../../constants/orderOptions';
import { attatchTTL } from '../../../utils/ttl';

export function* fetchMainUnitItems(unitId, orderType, orderBy, page) {
  const options = {
    orderType,
    orderBy,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/main/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchMainUnitItemsTotalCount(unitId, orderType, orderBy) {
  const options = { orderType, orderBy };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/main/${unitId}/count`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* getMainUnitPrimaryItem(unitId) {
  const options = {
    orderType: MainOrderOptions.DEFAULT.order_type,
    orderBy: MainOrderOptions.DEFAULT.order_by,
    offset: 0,
    limit: 1,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/main/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return attatchTTL(response.data.items)[0];
}

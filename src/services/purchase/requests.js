import { put } from 'redux-saga/effects';
import { stringify } from 'qs';

import config from '../../config';
import { snakelize } from '../../utils/snakelize';
import { getAPI } from '../../api/actions';

import { LIBRARY_ITEMS_LIMIT } from './constants';

export function* fetchPurchaseItems(
  orderType,
  orderBy,
  filter,
  offset,
  limit = LIBRARY_ITEMS_LIMIT,
) {
  const options = snakelize({
    orderType,
    orderBy,
    filter,
    offset,
    limit,
  });

  const api = yield put(getAPI());
  const response = yield api.get(
    `${config.LIBRARY_API_BASE_URL}/items/?${stringify(options)}`,
  );

  return response.data;
}

export function* fetchPurchaseItemsTotalCount(orderType, orderBy, filter) {
  const options = snakelize({ orderType, orderBy, filter });

  const api = yield put(getAPI());
  const response = yield api.get(
    `${config.LIBRARY_API_BASE_URL}/items/count?${stringify(options)}`,
  );
  return response.data;
}

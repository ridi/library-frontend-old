import { put } from 'redux-saga/effects';
import { stringify } from 'qs';

import config from '../../../config';
import { snakelize } from '../../../utils/snakelize';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT } from '../../purchase/constants';

export function* fetchPurchasedHiddenItems(page) {
  const options = snakelize({
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT),
    limit: LIBRARY_ITEMS_LIMIT,
  });

  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/items/hidden/?${stringify(options)}`);

  return response.data;
}

export function* fetchPurchasedHiddenItemsTotalCount() {
  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/items/hidden/count/`);
  return response.data;
}

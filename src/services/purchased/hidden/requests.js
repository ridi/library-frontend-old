import { put } from 'redux-saga/effects';
import { stringify } from 'qs';

import config from '../../../config';
import { snakelize } from '../../../utils/snakelize';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';

export function* fetchHiddenItems(page) {
  const options = snakelize({
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  });

  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/items/hidden/?${stringify(options)}`);

  return response.data;
}

export function* fetchHiddenItemsTotalCount() {
  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/items/hidden/count/`);
  return response.data;
}

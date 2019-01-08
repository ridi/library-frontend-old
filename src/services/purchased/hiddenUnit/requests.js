import { put } from 'redux-saga/effects';

import config from '../../../config';
import { snakelize } from '../../../utils/snakelize';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';

export function* fetchHiddenUnitItems(unitId, page) {
  const options = snakelize({
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  });

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/hidden/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchHiddenUnitItemsTotalCount(unitId) {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/hidden/${unitId}/count`, {}, config.LIBRARY_API_BASE_URL));
  return response.data;
}

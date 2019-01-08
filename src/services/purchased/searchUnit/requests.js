import { put } from 'redux-saga/effects';

import config from '../../../config';
import { snakelize } from '../../../utils/snakelize';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';

export function* fetchSearchUnitItems(unitId, orderType, orderBy, page) {
  const options = snakelize({
    orderType,
    orderBy,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  });

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/search/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchSearchUnitItemsTotalCount(unitId, orderType, orderBy) {
  const options = snakelize({ orderType, orderBy });

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/search/${unitId}/count`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

import { put } from 'redux-saga/effects';

import config from '../../../config';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';

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

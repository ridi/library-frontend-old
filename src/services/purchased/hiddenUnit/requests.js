import { put } from 'redux-saga/effects';

import config from '../../../config';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';
import { attatchTTL } from '../../../utils/ttl';

export function* fetchHiddenUnitItems(unitId, page) {
  const options = {
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/hidden/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  if (response.data.items) {
    response.data.items = response.data.items.map(item => ({ ...item, purchased: true }));
  }
  return response.data;
}

export function* fetchHiddenUnitItemsTotalCount(unitId) {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/hidden/${unitId}/count`, {}, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* getHiddenUnitPrimaryItem(unitId) {
  const options = {
    offset: 0,
    limit: 1,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/hidden/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return attatchTTL(response.data.items)[0];
}

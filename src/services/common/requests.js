import { put } from 'redux-saga/effects';

import config from '../../config';
import { getAPI } from '../../api/actions';

import { makeURI } from '../../utils/uri';
import { toFlatten } from '../../utils/array';

export function* getRevision() {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/commands/items/u/revision/', {}, config.LIBRARY_API_BASE_URL));
  return response.data.revision;
}

export function* triggerDownload(bookIds) {
  const query = {
    b_ids: bookIds,
    preprocess: true,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/api/user_books/trigger_download', query, config.STORE_API_BASE_URL));
  return response.data;
}

export function* requestGetBookIdsByUnitIds(orderType, orderBy, unitIds) {
  if (unitIds.length === 0) {
    return {};
  }

  const query = {
    orderType,
    orderBy,
    unitIds,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/fields/b_ids/', query, config.LIBRARY_API_BASE_URL));
  return response.data.result;
}

export function* requestHide(bookIds, revision) {
  const api = yield put(getAPI());
  const response = yield api.put(`${config.LIBRARY_API_BASE_URL}/commands/items/u/hide/`, {
    b_ids: bookIds,
    revision,
  });

  return toFlatten(response.data.items, 'id');
}

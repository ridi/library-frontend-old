import { put } from 'redux-saga/effects';

import config from '../../config';
import { getAPI } from '../../api/actions';

export function* getRevision() {
  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/commands/items/u/revision/`);
  return response.data.revision;
}

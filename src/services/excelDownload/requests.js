import { put } from 'redux-saga/effects';
import { getAPI } from '../../api/actions';
import config from '../../config';
import { makeURI } from '../../utils/uri';

export function* fetchStartExcelDownload() {
  const options = {
    t: +new Date(),
  };

  const api = yield put(getAPI());
  const response = yield api.post(makeURI('/items/excel', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchCheckExcelDownload(queueId) {
  const options = {
    t: +new Date(),
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`items/excel/${queueId}`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

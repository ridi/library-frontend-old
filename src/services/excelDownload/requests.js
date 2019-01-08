import { put } from 'redux-saga/effects';
import { stringify } from 'qs';
import { getAPI } from '../../api/actions';
import config from '../../config';
import { snakelize } from '../../utils/snakelize';

export function* fetchStartExcelDownload() {
  const options = snakelize({
    t: +new Date(),
  });

  const api = yield put(getAPI());
  const response = yield api.post(`${config.LIBRARY_API_BASE_URL}/items/excel?${stringify(options)}`);
  return response.data;
}

export function* fetchCheckExcelDownload(queueId) {
  const options = snakelize({
    t: +new Date(),
  });

  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/items/excel/${queueId}?${stringify(options)}`);
  return response.data;
}

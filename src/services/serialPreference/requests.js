import { put } from 'redux-saga/effects';

import config from '../../config';
import { getAPI } from '../../api/actions';

import { SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { calcOffset } from '../../utils/pagination';
import { makeURI } from '../../utils/uri';

export function* fetchSerialPreferenceItems(page) {
  const options = {
    offset: calcOffset(page, SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE),
    limit: SERIAL_PREFERENCE_ITEMS_LIMIT_PER_PAGE,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/serial-preference', options, config.BOOK_FEEDBACK_API_BASE_URL));
  return response.data;
}

export function* deleteSerialPreferenceItems(bookSeriesIds) {
  const options = {
    series_ids: bookSeriesIds,
  };
  const api = yield put(getAPI());
  const response = yield api.delete(makeURI('/serial-preference', options, config.BOOK_FEEDBACK_API_BASE_URL));
  return response.data;
}

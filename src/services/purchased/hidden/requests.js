import { put } from 'redux-saga/effects';

import { getAPI } from '../../../api/actions';
import config from '../../../config';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcOffset } from '../../../utils/pagination';
import { makeURI } from '../../../utils/uri';

export function* fetchHiddenItems(page) {
  const options = {
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/hidden', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchHiddenItemsTotalCount() {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/hidden/count', {}, config.LIBRARY_API_BASE_URL));
  return response.data;
}

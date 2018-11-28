import { put } from 'redux-saga/effects';

import config from '../../../config';
import { snakelize } from '../../../utils/snakelize';
import { calcOffset } from '../../../utils/pagination';
import { makeURI } from '../../../utils/uri';
import { toFlatten } from '../../../utils/array';

import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';

export function* fetchSearchItems(keyword, page) {
  const options = snakelize({
    keyword,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  });

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/search/', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchSearchItemsTotalCount(keyword) {
  const options = snakelize({
    keyword,
  });

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/search/count/', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* requestHide(bookIds, revision) {
  const api = yield put(getAPI());
  const response = yield api.put(`${config.LIBRARY_API_BASE_URL}/commands/items/u/hide/`, {
    b_ids: bookIds,
    revision,
  });

  return toFlatten(response.data.items, 'id');
}
export function* requestDownload(bookIds) {}

import { put } from 'redux-saga/effects';

import config from '../../../config';

import { calcOffset } from '../../../utils/pagination';
import { makeURI } from '../../../utils/uri';

import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { InvalidKeywordError } from './errors';

export function* fetchSearchItems(keyword, page) {
  const options = {
    keyword,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  const api = yield put(getAPI());
  try {
    const response = yield api.get(makeURI('/items/search/', options, config.LIBRARY_API_BASE_URL));
    return response.data;
  } catch (err) {
    if (err.response.status === 400) {
      throw new InvalidKeywordError();
    }

    throw new Error('Unknown');
  }
}

export function* fetchSearchItemsTotalCount(keyword) {
  const options = {
    keyword,
  };

  const api = yield put(getAPI());
  try {
    const response = yield api.get(makeURI('/items/search/count/', options, config.LIBRARY_API_BASE_URL));
    return response.data;
  } catch (err) {
    if (err.response.status === 400) {
      throw new InvalidKeywordError();
    }

    throw new Error('Unknown');
  }
}

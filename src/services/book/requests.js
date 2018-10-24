import { put } from 'redux-saga/effects';
import { getAPI } from '../../api/actions';

import config from '../../config';

import { makeTTL } from '../../utils/ttl';

const _attatchTTL = books => {
  const ttl = makeTTL();
  return books.map(book => {
    book.ttl = ttl;
    return book;
  });
};

export function* fetchBookData(bookIds) {
  const api = yield put(getAPI());
  const response = yield api.get(
    `${config.PLATFORM_API_BASE_URL}/books?b_ids=${bookIds.join(',')}`,
  );
  return _attatchTTL(response.data);
}

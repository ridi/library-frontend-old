
import { put } from 'redux-saga/effects';
import { getAPI } from "../../api/actions";

import config from '../../config';


const _TTL_MINS = 10;
const _makeTTL = () => {
  let now = new Date();
  now = now.setMinutes(now.getMinutes() + _TTL_MINS);
  return parseInt(now.getTime() / 1000, 10);
};

const _toMap = books => {
  const ttl = _makeTTL();

  return books.reduce((previous, current) => {
    const book = {
      ...current,
      ttl,
    };

    return previous[book.id] = book;
  }, {});
};

export function* fetchBookData (bookIds) {
  const api = yield put(getAPI());
  const response = yield api.post(`${config.PLATFORM_API_BASE_URL}/books`, {
    b_ids: bookIds
  });
  return _toMap(response.data);
}

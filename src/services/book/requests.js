
import { put } from 'redux-saga/effects';
import { getAPI } from "../../api/actions";

import config from '../../config';

import { makeTTL } from '../../utils/ttl';

const _toMap = books => {
  const ttl = makeTTL();
  return books.reduce((previous, current) => ({
    ...previous,
    [current.id]: {
      ...current,
      ttl,
    },
  }), {});
};

export function* fetchBookData (bookIds) {
  const api = yield put(getAPI());
  const response = yield api.get(`${config.PLATFORM_API_BASE_URL}/books?b_ids=${bookIds.join(',')}`);
  return _toMap(response.data);
}

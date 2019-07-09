import { put } from 'redux-saga/effects';
import { getAPI } from '../../../api/actions';
import { HttpStatusCode } from '../../../api/constants';

import config from '../../../config';
import { makeURI } from '../../../utils/uri';
import { NotFoundReadLatestError } from './errors';

export function* fetchReadLatestBookId(seriesId) {
  const api = yield put(getAPI());

  try {
    const response = yield api.get(
      makeURI(`/api/user/reading-histories/series/${seriesId}/latest`, { simple: true }, config.VIEWER_API_BASE_URL),
    );
    return response.data.result;
  } catch (err) {
    if (err.response.status === HttpStatusCode.HTTP_404_NOT_FOUND) {
      throw new NotFoundReadLatestError();
    }
    throw err;
  }
}

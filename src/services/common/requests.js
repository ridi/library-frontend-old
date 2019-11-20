import { all, call, put } from 'redux-saga/effects';

import { ServiceType } from 'constants/serviceType';
import { BooksPageKind } from 'constants/urls';
import { arrayChunk, makeUnique, toFlatten } from 'utils/array';
import { delay } from 'utils/delay';
import { getOrderParams } from 'utils/order';
import { snakelize } from 'utils/snakelize';
import { makeURI } from 'utils/uri';

import { getAPI } from '../../api/actions';
import config from '../../config';
import { DELETE_API_CHUNK_COUNT } from './constants';
import { MakeBookIdsError, UnhideError } from './errors';

export function* getRevision() {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/commands/items/u/revision/', {}, config.LIBRARY_API_BASE_URL));
  return response.data.revision;
}

export function* requestCheckQueueStatus(queueIds) {
  const api = yield put(getAPI());
  let retryCount = 0;
  const retryMaxCount = 3;
  const retryDuration = 2000;

  function* _request(_queueIds) {
    const data = snakelize({
      queueIds: _queueIds,
    });

    const response = yield api.post(makeURI('/commands/items/u/queue/status/', {}, config.LIBRARY_API_BASE_URL), data);
    const { is_finished: isFinished, queue_ids: syncingQueueIds } = response.data;

    if (isFinished) {
      return true;
    }

    if (syncingQueueIds.length === 0 || retryCount >= retryMaxCount) {
      return false;
    }

    retryCount += 1;
    yield delay(retryDuration);
    return yield _request(syncingQueueIds);
  }

  return yield _request(queueIds);
}

export function* requestGetBookIdsByUnitIds(unitIds, { kind, orderBy, orderDirection, filter }) {
  if (unitIds.length === 0) {
    return {};
  }

  let query = {
    unitIds,
  };
  let endpoint = '';

  if (kind === BooksPageKind.HIDDEN) {
    endpoint = '/items/hidden/fields/b_ids/';
  } else {
    endpoint = '/items/fields/b_ids/';
    if (filter && ServiceType.includes(filter)) {
      query.serviceType = filter;
    }
    query = {
      ...query,
      ...getOrderParams(orderBy, orderDirection),
    };
  }

  const api = yield put(getAPI());
  try {
    const response = yield api.get(makeURI(endpoint, query, config.LIBRARY_API_BASE_URL));
    return response.data.result;
  } catch (err) {
    throw new MakeBookIdsError();
  }
}

export function* requestGetBookIdsByUnitIdsForHidden(unitIds) {
  return yield call(requestGetBookIdsByUnitIds, unitIds, { kind: BooksPageKind.HIDDEN });
}

export function* requestUnhide(bookIds, revision) {
  const options = {
    b_ids: bookIds,
    revision,
  };

  const api = yield put(getAPI());
  try {
    const response = yield api.put(makeURI('/commands/items/u/unhide/', {}, config.LIBRARY_API_BASE_URL), options);
    return toFlatten(response.data.items, 'id');
  } catch (err) {
    throw new UnhideError();
  }
}

export function* requestHide(bookIds, revision) {
  const options = {
    b_ids: bookIds,
    revision,
  };

  const api = yield put(getAPI());
  const response = yield api.put(makeURI('/commands/items/u/hide/', {}, config.LIBRARY_API_BASE_URL), options);
  return toFlatten(response.data.items, 'id');
}

export function* fetchRequestToken() {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/commands/items/u/request-token/', {}, config.LIBRARY_API_BASE_URL));
  return response.data.token;
}

export function* getRequestTokenHeader() {
  const token = yield fetchRequestToken();
  return { 'X-REQUEST-TOKEN': token };
}

export function* requestDelete(bookIds, revision) {
  function* internalRequestDelete(_bookIds) {
    const options = {
      b_ids: _bookIds,
      revision,
    };

    const api = yield put(getAPI());
    const response = yield api.put(
      makeURI('/commands/items/u/delete/', {}, config.LIBRARY_API_BASE_URL),
      options,
      yield getRequestTokenHeader(),
    );
    return toFlatten(response.data, 'id');
  }

  const chunked = arrayChunk(bookIds, DELETE_API_CHUNK_COUNT);
  const queueIdChunks = yield all(chunked.map(_bookIds => call(internalRequestDelete, _bookIds)));
  const queueIds = queueIdChunks.flat();

  return makeUnique(queueIds);
}

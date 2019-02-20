import { put } from 'redux-saga/effects';

import config from '../../config';
import { getAPI } from '../../api/actions';
import { OrderType } from '../../constants/orderOptions';

import { makeURI } from '../../utils/uri';
import { makeUnique, splitArrayByChunk, toFlatten } from '../../utils/array';
import { snakelize } from '../../utils/snakelize';
import { delay } from '../../utils/delay';
import { DELETE_API_CHUNK_COUNT } from './constants';
import { UnhideError, MakeBookIdsError } from './errors';

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

export function* requestGetBookIdsByUnitIds(orderType, orderBy, unitIds) {
  if (unitIds.length === 0) {
    return {};
  }

  const query = {
    unitIds,
  };

  if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
    query.expiredBooksOnly = true;
  } else {
    query.orderType = orderType;
    query.orderBy = orderBy;
  }

  const api = yield put(getAPI());
  try {
    const response = yield api.get(makeURI('/items/fields/b_ids/', query, config.LIBRARY_API_BASE_URL));
    return response.data.result;
  } catch (err) {
    throw new MakeBookIdsError();
  }
}

export function* requestGetBookIdsByUnitIdsForHidden(unitIds) {
  if (unitIds.length === 0) {
    return {};
  }

  const query = {
    unitIds,
  };

  const api = yield put(getAPI());
  try {
    const response = yield api.get(makeURI('/items/hidden/fields/b_ids/', query, config.LIBRARY_API_BASE_URL));
    return response.data.result;
  } catch (err) {
    throw new MakeBookIdsError();
  }
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

  const chunked = splitArrayByChunk(bookIds, DELETE_API_CHUNK_COUNT);
  const queueIds = [];

  for (const _bookIds of chunked) {
    const _queueIds = yield internalRequestDelete(_bookIds);
    queueIds.push(..._queueIds);
  }

  return makeUnique(queueIds);
}

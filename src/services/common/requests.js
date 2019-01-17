import { call, put } from 'redux-saga/effects';

import config from '../../config';
import { getAPI } from '../../api/actions';

import { makeURI } from '../../utils/uri';
import { toFlatten } from '../../utils/array';
import { snakelize } from '../../utils/snakelize';
import { delay } from '../../utils/delay';
import { showToast } from '../toast/actions';
import { download } from './sagas';

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

    if (syncingQueueIds.length === 0 || retryCount < retryMaxCount) {
      return false;
    }

    retryCount += 1;
    yield delay(retryDuration);
    const _isFinished = yield _request(syncingQueueIds);
    return _isFinished;
  }

  const isFinish = yield _request(queueIds);
  return isFinish;
}

export function* triggerDownload(bookIds) {
  const query = {
    b_ids: bookIds,
    preprocess: true,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/api/user_books/trigger_download', query, config.STORE_API_BASE_URL));
  return response.data;
}

export function* requestGetBookIdsByUnitIds(orderType, orderBy, unitIds) {
  if (unitIds.length === 0) {
    return {};
  }

  const query = {
    orderType,
    orderBy,
    unitIds,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/fields/b_ids/', query, config.LIBRARY_API_BASE_URL));
  return response.data.result;
}

export function* requestGetBookIdsByUnitIdsForHidden(unitIds) {
  if (unitIds.length === 0) {
    return {};
  }

  const query = {
    unitIds,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/hidden/fields/b_ids/', query, config.LIBRARY_API_BASE_URL));
  return response.data.result;
}

export function* requestUnhide(bookIds, revision) {
  const options = {
    b_ids: bookIds,
    revision,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/commands/items/u/unhide/', options, config.LIBRARY_API_BASE_URL));
  return toFlatten(response.data.items, 'id');
}

export function* requestHide(bookIds, revision) {
  const options = {
    b_ids: bookIds,
    revision,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/commands/items/u/hide/', options, config.LIBRARY_API_BASE_URL));
  return toFlatten(response.data.items, 'id');
}

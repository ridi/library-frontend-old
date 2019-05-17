import { all, call, put, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import uuidv4 from 'uuid/v4';
import * as actions from './actions';
import * as requests from './requests';

const COUNT_PER_PAGE = 20;

const OperationType = {
  ADD_SHELF: 'add_shelf',
  DELETE_SHELF: 'delete_shelf',
  ADD_SHELF_ITEM: 'add_shelf_item',
  DELETE_SHELF_ITEM: 'delete_shelf_item',
};

const OperationStatus = {
  UNDONE: 'undone',
  DONE: 'done',
  FORBIDDEN: 'forbidden',
};

function* loadShelves({ payload }) {
  const { orderBy, orderDirection, page } = payload;
  const offset = (page - 1) * COUNT_PER_PAGE;
  const limit = COUNT_PER_PAGE;
  const items = yield call(requests.fetchShelves, { offset, limit });
  yield put(actions.setShelves({ orderBy, orderDirection, page, items }));
}

function* loadShelfCount() {
  const count = yield call(requests.fetchShelfCount);
  yield put(actions.setShelfCount(count));
}

function* performOperation(ops) {
  if (ops.length === 0) {
    return [];
  }

  const revision = Math.floor(Date.now() / 1000);
  const opsWithRevision = ops.map(op => ({ ...op, revision }));
  yield put(actions.beginOperation({ revision }));

  let opIds = [];
  while (true) {
    try {
      opIds = yield call(requests.createOperation, opsWithRevision);
      break;
    } catch (err) {
      if (err.response) {
        yield put(actions.endOperation({ revision, hasError: true }));

        const { status } = err.response;
        if (status === 403) {
          return ops.map(() => ({ id: null, result: OperationStatus.FORBIDDEN }));
        }
        // TODO: 던지지 말고 처리?
        throw err;
      }
      // 네트워크 에러 등, 재시도
    }
  }

  const results = {};
  let pendingIds = opIds;
  yield delay(100);
  while (true) {
    try {
      const statuses = yield call(requests.fetchOperationStatus, pendingIds);
      const resolvedOps = statuses.filter(({ status }) => status !== OperationStatus.UNDONE);
      pendingIds = statuses.filter(({ status }) => status === OperationStatus.UNDONE).map(({ id }) => id);
      for (const { id, status } of resolvedOps) {
        results[id] = status;
      }
      if (pendingIds.length === 0) {
        break;
      }
    } catch (err) {
      if (err.response) {
        // TODO: 적절한 처리?
      }
      // 네트워크 에러 등, 재시도
    }
    yield delay(1000);
  }

  yield put(actions.endOperation({ revision, hasError: false }));
  return opIds.map(id => ({
    id,
    result: results[id],
  }));
}

function* addShelf({ payload }) {
  const { name } = payload;
  while (true) {
    const uuid = uuidv4();
    const results = yield call(performOperation, [{ type: OperationType.ADD_SHELF, uuid, name }]);
    if (results[0].status === OperationStatus.DONE) {
      break;
    }
    // 실패한 경우 uuid를 바꾸어 재시도
  }
}

function* deleteShelf({ payload }) {
  const { uuid } = payload;
  yield call(performOperation, [{ type: OperationType.DELETE_SHELF, uuid }]);
  // 책장 삭제 에러는 무시함
}

export default function* shelfRootSaga() {
  yield all([
    takeEvery(actions.LOAD_SHELVES, loadShelves),
    takeEvery(actions.LOAD_SHELF_COUNT, loadShelfCount),
    takeEvery(actions.ADD_SHELF, addShelf),
    takeEvery(actions.DELETE_SHELF, deleteShelf),
  ]);
}

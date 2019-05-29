import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import uuidv4 from 'uuid/v4';
import * as bookRequests from '../book/requests';
import * as bookSagas from '../book/sagas';
import * as selectionActions from '../selection/actions';
import * as selectionSelectors from '../selection/selectors';
import * as actions from './actions';
import * as requests from './requests';

const COUNT_PER_PAGE = 20;
const BOOK_COUNT_PER_PAGE = 48;

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

function* loadShelves(isServer, { payload }) {
  const { orderBy, orderDirection, page } = payload;
  const offset = (page - 1) * COUNT_PER_PAGE;
  const limit = COUNT_PER_PAGE;
  try {
    const items = yield call(requests.fetchShelves, { offset, limit });
    yield put(actions.setShelves({ orderBy, orderDirection, page, items }));
  } catch (err) {
    if (!err.response || err.response.status !== 401 || !isServer) {
      throw err;
    }
  }
}

function* loadShelfCount(isServer) {
  try {
    const count = yield call(requests.fetchShelfCount);
    yield put(actions.setShelfCount(count));
  } catch (err) {
    if (!err.response || err.response.status !== 401 || !isServer) {
      throw err;
    }
  }
}

function* loadShelfBooks(isServer, { payload }) {
  const { uuid, orderBy, orderDirection, page } = payload;
  const offset = (page - 1) * BOOK_COUNT_PER_PAGE;
  const limit = BOOK_COUNT_PER_PAGE;
  try {
    const { items, shelfInfo } = yield call(requests.fetchShelfBooks, { uuid, offset, limit });
    yield put(actions.setShelfInfo(shelfInfo));
    const libraryBooks = yield call(bookRequests.fetchLibraryUnitData, items.map(item => item.unitId));
    yield put(actions.setLibraryBooks(libraryBooks));
    const bookIds = libraryBooks.map(book => book.b_id);
    yield call(bookSagas.loadBookData, bookIds);
    yield put(actions.setShelfBooks(uuid, { orderBy, orderDirection, page, items }));
  } catch (err) {
    if (!err.response || err.response.status !== 401 || !isServer) {
      throw err;
    }
  }
}

function* loadShelfBookCount(isServer, { payload }) {
  const { uuid } = payload;
  try {
    const count = yield call(requests.fetchShelfBookCount, { uuid });
    yield put(actions.setShelfBookCount({ uuid, count }));
  } catch (err) {
    if (!err.response || err.response.status !== 401 || !isServer) {
      throw err;
    }
  }
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
    if (results[0].result === OperationStatus.DONE) {
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

function* addShelfItem({ payload }) {
  const { uuid, units } = payload;
  const ops = units.map(({ unitId, bookIds }) => ({
    type: OperationType.ADD_SHELF_ITEM,
    uuid,
    unitId,
    bookIds,
  }));
  yield call(performOperation, ops);
  // TODO: forbidden인 경우 내 책장이 아닌 것
  yield put(actions.loadShelfBookCount(uuid));
}

function* deleteShelfItem({ payload }) {
  const { uuid, units } = payload;
  const ops = units.map(({ unitId, bookIds }) => ({
    type: OperationType.DELETE_SHELF_ITEM,
    uuid,
    unitId,
    bookIds,
  }));
  yield call(performOperation, ops);
  // TODO: forbidden인 경우 내 책장이 아닌 것
  yield put(actions.loadShelfBookCount(uuid));
}

function* removeSelectedFromShelf({ payload }) {
  const { uuid, pageOptions } = payload;
  const bookIds = Object.entries(yield select(selectionSelectors.getSelectedBooks))
    .filter(([, checked]) => checked)
    .map(([bookId]) => bookId);
  const bookToUnit = yield select(state => state.shelf.bookToUnit);
  const itemMap = yield select(state => state.shelf.itemMap);
  const units = bookIds.map(bookId => {
    const unitId = bookToUnit[bookId];
    return itemMap[unitId];
  });
  // invalidateShelfPage: 스켈레톤 강제로 띄우기 위한 action. 스피너로 대체하면 빼도 됨
  yield all([put(actions.invalidateShelfPage(uuid, pageOptions)), put(selectionActions.clearSelectedBooks())]);
  yield call(deleteShelfItem, { payload: { uuid, units } });
  yield put(actions.loadShelfBooks(uuid, pageOptions));
}

export default function* shelfRootSaga(isServer) {
  yield all([
    takeEvery(actions.LOAD_SHELVES, loadShelves, isServer),
    takeEvery(actions.LOAD_SHELF_COUNT, loadShelfCount, isServer),
    takeEvery(actions.LOAD_SHELF_BOOKS, loadShelfBooks, isServer),
    takeEvery(actions.LOAD_SHELF_BOOK_COUNT, loadShelfBookCount, isServer),
    takeEvery(actions.ADD_SHELF, addShelf),
    takeEvery(actions.DELETE_SHELF, deleteShelf),
    takeEvery(actions.ADD_SHELF_ITEM, addShelfItem),
    takeEvery(actions.DELETE_SHELF_ITEM, deleteShelfItem),
    takeEvery(actions.REMOVE_SELECTED_FROM_SHELF, removeSelectedFromShelf),
  ]);
}

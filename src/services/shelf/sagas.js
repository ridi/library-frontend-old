import Router from 'next/router';
import { all, call, fork, join, put, select, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import uuidv4 from 'uuid/v4';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE, SHELVES_LIMIT_PER_PAGE } from '../../constants/page';
import { makeLinkProps } from '../../utils/uri';
import { PageType, URLMap } from '../../constants/urls';
import * as bookRequests from '../book/requests';
import * as bookSagas from '../book/sagas';
import * as selectionActions from '../selection/actions';
import * as selectionSelectors from '../selection/selectors';
import * as toastActions from '../toast/actions';
import { ToastStyle } from '../toast/constants';
import * as uiActions from '../ui/actions';
import * as actions from './actions';
import * as requests from './requests';
import * as selectors from './selectors';

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

function* loadShelves(isServer, { payload }) {
  const { orderBy, orderDirection, page } = payload;
  const offset = (page - 1) * SHELVES_LIMIT_PER_PAGE;
  const limit = SHELVES_LIMIT_PER_PAGE;
  try {
    const items = yield call(requests.fetchShelves, { offset, limit });
    yield put(actions.setShelves({ orderBy, orderDirection, page, items }));
    yield all(items.map(({ uuid }) => fork(loadShelfBookCount, isServer, { payload: { uuid } })));
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
  const offset = (page - 1) * LIBRARY_ITEMS_LIMIT_PER_PAGE;
  const limit = LIBRARY_ITEMS_LIMIT_PER_PAGE;
  try {
    const { items, shelfInfo } = yield call(requests.fetchShelfBooks, { uuid, offset, limit });
    yield put(actions.setShelfInfo(shelfInfo));
    const libraryBooks = yield call(
      bookRequests.fetchLibraryUnitData,
      items.map(item => ({ unitId: item.unitId, fallbackBookId: item.bookIds[0] })),
    );
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

function* waitForOperation(revision, opIds) {
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

function* createOperation(ops) {
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

  return yield fork(waitForOperation, revision, opIds);
}

function* performOperation(ops) {
  return yield join(yield call(createOperation, ops));
}

function* addShelf({ payload }) {
  const { name, pageOptions } = payload;
  yield put(uiActions.setFullScreenLoading(true));
  while (true) {
    const uuid = uuidv4();
    const results = yield call(performOperation, [{ type: OperationType.ADD_SHELF, uuid, name }]);
    if (results[0].result === OperationStatus.DONE) {
      break;
    }
  }
  yield all([put(uiActions.setFullScreenLoading(false)), put(actions.loadShelves(pageOptions)), put(actions.loadShelfCount())]);
}

function* renameShelf({ payload }) {
  const { uuid, name } = payload;
  const [, results] = yield all([
    put(uiActions.setFullScreenLoading(true)),
    call(performOperation, [{ type: OperationType.ADD_SHELF, uuid, name }]),
  ]);
  // TODO: forbidden인 경우 내 책장이 아닌 것
  yield put(uiActions.setFullScreenLoading(false));
  if (results[0].result === OperationStatus.DONE) {
    yield all([put(actions.setShelfInfo({ uuid, name })), put(toastActions.showToast({ message: '책장 이름을 변경했습니다.' }))]);
  } else {
    yield put(toastActions.showToast({ message: '책장 이름 변경에 실패했습니다.', toastStyle: ToastStyle.RED }));
  }
}

function* deleteShelf({ payload }) {
  const { uuid } = payload;
  yield call(performOperation, [{ type: OperationType.DELETE_SHELF, uuid }]);
  // 책장 삭제 에러는 무시함
}

function* deleteShelves({ payload }) {
  const { uuids, pageOptions } = payload;
  const ops = uuids.map(uuid => ({
    type: OperationType.DELETE_SHELF,
    uuid,
  }));
  yield all([put(uiActions.setFullScreenLoading(true)), put(selectionActions.clearSelectedItems()), call(performOperation, ops)]);
  yield all([
    put(uiActions.setFullScreenLoading(false)),
    put(
      toastActions.showToast({
        message: '책장 목록에서 삭제했습니다.',
        withBottomFixedButton: true,
      }),
    ),
    put(actions.loadShelves(pageOptions)),
    put(actions.loadShelfCount()),
  ]);
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

function* deleteShelfFromDetail({ payload }) {
  const { uuid } = payload;
  yield put(uiActions.setFullScreenLoading(true));
  yield call(deleteShelf, { payload: { uuid } });
  Router.push(URLMap.shelves.href, URLMap.shelves.as);
  yield all([
    put(uiActions.setFullScreenLoading(false)),
    put(
      toastActions.showToast({
        message: '책장을 삭제했습니다.',
        withBottomFixedButton: true,
      }),
    ),
  ]);
}

function* addSelectedToShelf({ payload }) {
  const { uuid } = payload;
  const selectedBooks = yield select(selectionSelectors.getSelectedItems);
  const bookIds = Object.entries(selectedBooks)
    .filter(([, selected]) => selected)
    .map(([key]) => key);
  const libraryBookData = yield call(bookRequests.fetchLibraryBookData, bookIds);
  const units = libraryBookData.items.map(book => ({
    unitId: book.search_unit_id,
    bookIds: [book.b_id],
  }));
  const shelfName = yield select(selectors.getShelfName, uuid);
  yield call(addShelfItem, { payload: { uuid, units } });
  yield put(
    toastActions.showToast({
      message: `${units.length}권을 "${shelfName}" 책장에 추가했습니다.`,
      linkName: '책장 바로 보기',
      linkProps: makeLinkProps(
        {
          pathname: URLMap[PageType.SHELF_DETAIL].href,
          query: { uuid },
        },
        URLMap[PageType.SHELF_DETAIL].as({ uuid }),
      ),
    }),
  );
}

function* removeSelectedFromShelf({ payload }) {
  const { uuid, pageOptions } = payload;
  const bookIds = Object.entries(yield select(selectionSelectors.getSelectedItems))
    .filter(([, checked]) => checked)
    .map(([bookId]) => bookId);
  const bookToUnit = yield select(state => state.shelf.bookToUnit);
  const itemMap = yield select(state => state.shelf.itemMap);
  const units = bookIds.map(bookId => {
    const unitId = bookToUnit[bookId];
    return itemMap[unitId];
  });
  // invalidateShelfPage: 스켈레톤 강제로 띄우기 위한 action. 스피너로 대체하면 빼도 됨
  yield all([
    put(actions.invalidateShelfPage(uuid, pageOptions)),
    put(
      toastActions.showToast({
        message: `${bookIds.length}권을 책장에서 삭제했습니다.`,
        withBottomFixedButton: true,
      }),
    ),
    put(selectionActions.clearSelectedItems()),
  ]);
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
    takeEvery(actions.RENAME_SHELF, renameShelf),
    takeEvery(actions.DELETE_SHELF, deleteShelf),
    takeEvery(actions.DELETE_SHELVES, deleteShelves),
    takeEvery(actions.ADD_SHELF_ITEM, addShelfItem),
    takeEvery(actions.DELETE_SHELF_ITEM, deleteShelfItem),
    takeEvery(actions.DELETE_SHELF_FROM_DETAIL, deleteShelfFromDetail),
    takeEvery(actions.ADD_SELECTED_TO_SHELF, addSelectedToShelf),
    takeEvery(actions.REMOVE_SELECTED_FROM_SHELF, removeSelectedFromShelf),
  ]);
}

import { all, call, delay, fork, join, put, select, takeEvery } from 'redux-saga/effects';
import uuidv4 from 'uuid/v4';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE, SHELVES_LIMIT_PER_PAGE } from '../../constants/page';
import { ITEMS_LIMIT_PER_SHELF, SHELVES_LIMIT } from '../../constants/shelves';
import { PageType, URLMap } from '../../constants/urls';
import { thousandsSeperator } from '../../utils/number';
import { makeLinkProps } from '../../utils/uri';
import * as bookRequests from '../book/requests';
import * as bookSagas from '../book/sagas';
import * as bookDownloadActions from '../bookDownload/actions';
import { MakeBookIdsError } from '../common/errors';
import * as dialogActions from '../dialog/actions';
import * as selectionActions from '../selection/actions';
import * as selectionSelectors from '../selection/selectors';
import * as toastActions from '../toast/actions';
import { ToastStyle } from '../toast/constants';
import * as uiActions from '../ui/actions';
import * as actions from './actions';
import { OperationStatus } from './constants';
import * as requests from './requests';
import * as selectors from './selectors';

const OperationEndpoint = {
  SHELF: 'shelf',
  SHELF_ITEM: 'shelfItem',
};

const OperationType = {
  ADD_SHELF: 'add_shelf',
  DELETE_SHELF: 'delete_shelf',
  ADD_SHELF_ITEM: 'add_shelf_item',
  DELETE_SHELF_ITEM: 'delete_shelf_item',
};

function* loadShelfBookCount({ payload }) {
  const { uuid } = payload;
  try {
    const count = yield call(requests.fetchShelfBookCount, { uuid });
    yield put(actions.setShelfBookCount({ uuid, count }));
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
  }
}

function* loadShelves({ payload }) {
  const { orderBy, orderDirection, page } = payload;
  const offset = (page - 1) * SHELVES_LIMIT_PER_PAGE;
  const limit = SHELVES_LIMIT_PER_PAGE;
  try {
    const items = yield call(requests.fetchShelves, { offset, limit, orderType: orderBy, orderBy: orderDirection });
    yield put(actions.setShelves({ orderBy, orderDirection, page, items }));
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
  }
}

function* loadShelfCount() {
  try {
    const count = yield call(requests.fetchShelfCount);
    yield put(actions.setShelfCount(count));
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
  }
}

function* loadShelfBooks({ payload }) {
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
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
  }
}

function* waitForOperation(revision, opResults) {
  const results = new Map(opResults.map(({ id, status }) => [id, status]));
  while (true) {
    const pendingIds = [...results.entries()].filter(([, result]) => result === OperationStatus.UNDONE).map(([id]) => id);
    if (pendingIds.length === 0) {
      break;
    }

    yield delay(1000);
    try {
      const statuses = yield call(requests.fetchOperationStatus, pendingIds);
      statuses.forEach(({ id, status }) => {
        results.set(id, status);
      });
    } catch (err) {
      if (err.response) {
        // TODO: 적절한 처리?
      }
      // 네트워크 에러 등, 재시도
    }
  }

  yield put(actions.endOperation({ revision, hasError: false }));
  return [...results.entries()].map(([id, result]) => ({ id, result }));
}

function* createOperation(endpoint, ops) {
  if (ops.length === 0) {
    return [];
  }

  const revision = Math.floor(Date.now() / 1000);
  const opsWithRevision = ops.map(op => ({ ...op, revision }));
  yield put(actions.beginOperation({ revision }));

  let opResults;
  while (true) {
    try {
      if (endpoint === OperationEndpoint.SHELF) {
        opResults = yield call(requests.createOperationShelf, opsWithRevision);
      } else {
        opResults = yield call(requests.createOperationShelfItem, opsWithRevision);
      }
      break;
    } catch (err) {
      if (err.response) {
        const { status } = err.response;
        if (status === 403) {
          opResults = ops.map(() => ({ id: null, status: OperationStatus.FORBIDDEN }));
        } else if (status === 404) {
          opResults = ops.map(() => ({ id: null, status: OperationStatus.FAILURE }));
        } else {
          yield put(actions.endOperation({ revision, hasError: true }));
          // TODO: 던지지 말고 처리?
          throw err;
        }
        break;
      }
      // 네트워크 에러 등, 재시도
    }
  }

  return yield fork(waitForOperation, revision, opResults);
}

function* performOperation(type, opArgs) {
  let endpoint;
  if (type === OperationType.ADD_SHELF || type === OperationType.DELETE_SHELF) {
    endpoint = OperationEndpoint.SHELF;
  } else {
    endpoint = OperationEndpoint.SHELF_ITEM;
  }

  const ops = Array.isArray(opArgs) ? opArgs : [opArgs];
  const opsWithType = ops.map(op => ({ ...op, type }));
  return yield join(yield call(createOperation, endpoint, opsWithType));
}

function* validateShelvesLimit({ payload }) {
  const { onValid, onInvalid } = payload;
  yield all([put(uiActions.setFullScreenLoading(true)), call(loadShelfCount, false)]);
  yield put(uiActions.setFullScreenLoading(false));
  const totalShelfCount = yield select(selectors.getShelfCount);
  if (totalShelfCount < SHELVES_LIMIT) {
    onValid && onValid();
  } else {
    onInvalid && onInvalid();
  }
}

function* addShelf({ payload }) {
  const { name, pageOptions } = payload;
  yield put(uiActions.setFullScreenLoading(true));
  while (true) {
    const uuid = uuidv4();
    const results = yield call(performOperation, OperationType.ADD_SHELF, { uuid, name });
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
    call(performOperation, OperationType.ADD_SHELF, { uuid, name }),
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
  yield call(performOperation, OperationType.DELETE_SHELF, { uuid });
  // 책장 삭제 에러는 무시함
}

function* deleteShelves({ payload }) {
  const { uuids, pageOptions } = payload;
  const ops = uuids.map(uuid => ({ uuid }));
  yield all([
    put(uiActions.setFullScreenLoading(true)),
    put(selectionActions.clearSelectedItems()),
    call(performOperation, OperationType.DELETE_SHELF, ops),
  ]);
  yield all([
    put(uiActions.setFullScreenLoading(false)),
    put(
      toastActions.showToast({
        message: '책장을 삭제했습니다.',
      }),
    ),
    put(actions.loadShelves(pageOptions)),
    put(actions.loadShelfCount()),
  ]);
}

function* addShelfItem({ payload }) {
  const { uuid, units } = payload;
  const ops = units.map(({ unitId, bookIds }) => ({
    uuid,
    unitId,
    bookIds,
  }));
  yield call(performOperation, OperationType.ADD_SHELF_ITEM, ops);
  // TODO: forbidden인 경우 내 책장이 아닌 것
  yield put(actions.loadShelfBookCount(uuid));
}

function* deleteShelfItem({ payload }) {
  const { uuid, units } = payload;
  const ops = units.map(({ unitId, bookIds }) => ({
    uuid,
    unitId,
    bookIds,
  }));
  yield call(performOperation, OperationType.DELETE_SHELF_ITEM, ops);
  // TODO: forbidden인 경우 내 책장이 아닌 것
  yield put(actions.loadShelfBookCount(uuid));
}

function* deleteShelfFromDetail({ payload }) {
  const { history, uuid } = payload;
  yield put(uiActions.setFullScreenLoading(true));
  yield call(deleteShelf, { payload: { uuid } });
  history.push(URLMap.shelves.as);
  yield all([
    put(uiActions.setFullScreenLoading(false)),
    put(
      toastActions.showToast({
        message: '책장을 삭제했습니다.',
      }),
    ),
  ]);
}

function* addSelectedToShelf({ payload }) {
  yield put(uiActions.setFullScreenLoading(true));
  const { fromShelfPageOptions, onComplete, uuid } = payload;
  try {
    const selectedBooks = yield select(selectionSelectors.getSelectedItems);
    const bookIds = Object.entries(selectedBooks)
      .filter(([, selected]) => selected)
      .map(([key]) => key);
    const count = yield call(requests.fetchShelfBookCount, { uuid });
    if (count + bookIds.length > ITEMS_LIMIT_PER_SHELF) {
      yield put(
        toastActions.showToast({
          message: `최대 ${thousandsSeperator(ITEMS_LIMIT_PER_SHELF)}권까지 추가할 수 있습니다.`,
          toastStyle: ToastStyle.RED,
        }),
      );
      return;
    }

    const libraryBookData = yield call(bookRequests.fetchLibraryBookData, bookIds);
    const units = libraryBookData.items.map(book => ({
      unitId: book.search_unit_id,
      bookIds: [book.b_id],
    }));
    yield call(addShelfItem, { payload: { uuid, units } });

    if (fromShelfPageOptions != null) {
      yield call(loadShelfBooks, { payload: { uuid, ...fromShelfPageOptions } });
      yield put(
        toastActions.showToast({
          message: '선택한 책을 책장에 추가했습니다.',
        }),
      );
    } else {
      yield put(
        toastActions.showToast({
          message: '선택한 책을 책장에 추가했습니다.',
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
    onComplete && onComplete();
  } catch (err) {
    console.error(err);
    yield put(
      toastActions.showToast({
        message: '책장에 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        toastStyle: ToastStyle.RED,
      }),
    );
  } finally {
    yield put(uiActions.setFullScreenLoading(false));
  }
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
  try {
    yield all([
      put(uiActions.setFullScreenLoading(true)),
      put(selectionActions.clearSelectedItems()),
      call(deleteShelfItem, { payload: { uuid, units } }),
    ]);
    yield call(loadShelfBooks, { payload: { uuid, ...pageOptions } });
    yield put(
      toastActions.showToast({
        message: '책장에서 삭제했습니다.',
      }),
    );
  } catch (err) {
    console.error(err);
    yield put(
      toastActions.showToast({
        message: '책장에서 삭제하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        toastStyle: ToastStyle.RED,
      }),
    );
  } finally {
    yield put(uiActions.setFullScreenLoading(false));
  }
}

function* downloadSelectedUnits() {
  const bookIds = Object.entries(yield select(selectionSelectors.getSelectedItems))
    .filter(([, checked]) => checked)
    .map(([bookId]) => bookId);
  const bookToUnit = yield select(state => state.shelf.bookToUnit);
  const unitIds = bookIds.map(bookId => bookToUnit[bookId]);
  try {
    yield put(bookDownloadActions.downloadBooksByUnitIds(unitIds));
  } catch (err) {
    let message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    if (err instanceof MakeBookIdsError) {
      message = '다운로드 대상 도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }
    yield put(dialogActions.showDialog('다운로드 오류', message));
  }
}

export default function* shelfRootSaga() {
  yield all([
    takeEvery(actions.LOAD_SHELVES, loadShelves),
    takeEvery(actions.LOAD_SHELF_COUNT, loadShelfCount),
    takeEvery(actions.LOAD_SHELF_BOOKS, loadShelfBooks),
    takeEvery(actions.LOAD_SHELF_BOOK_COUNT, loadShelfBookCount),
    takeEvery(actions.ADD_SHELF, addShelf),
    takeEvery(actions.RENAME_SHELF, renameShelf),
    takeEvery(actions.DELETE_SHELF, deleteShelf),
    takeEvery(actions.DELETE_SHELVES, deleteShelves),
    takeEvery(actions.ADD_SHELF_ITEM, addShelfItem),
    takeEvery(actions.DELETE_SHELF_ITEM, deleteShelfItem),
    takeEvery(actions.DELETE_SHELF_FROM_DETAIL, deleteShelfFromDetail),
    takeEvery(actions.ADD_SELECTED_TO_SHELF, addSelectedToShelf),
    takeEvery(actions.REMOVE_SELECTED_FROM_SHELF, removeSelectedFromShelf),
    takeEvery(actions.DOWNLOAD_SELECTED_UNITS, downloadSelectedUnits),
    takeEvery(actions.VALIDATE_SHELVES_LIMIT, validateShelvesLimit),
  ]);
}

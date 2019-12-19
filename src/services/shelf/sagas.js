import { all, call, delay, fork, join, put, select, takeEvery } from 'redux-saga/effects';
import uuidv4 from 'uuid/v4';

import { bookDownloadActions } from 'services/bookDownload/reducers';
import { selectionActions } from 'services/selection/reducers';
import { trackEvent } from 'services/tracking/actions';
import { EventNames } from 'services/tracking/constants';
import { arrayChunk } from 'utils/array';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE, SHELVES_LIMIT_PER_PAGE } from '../../constants/page';
import { ITEMS_LIMIT_PER_SHELF, SHELF_ITEM_OPERATION_LIMIT, SHELF_OPERATION_LIMIT, SHELVES_LIMIT } from '../../constants/shelves';
import { URLMap, PageType } from '../../constants/urls';
import { thousandsSeperator } from '../../utils/number';
import * as bookRequests from '../book/requests';
import * as bookSagas from '../book/sagas';
import { MakeBookIdsError } from '../common/errors';
import * as dialogActions from '../dialog/actions';
import * as selectionSelectors from '../selection/selectors';
import * as toastActions from '../toast/actions';
import { ToastStyle } from '../toast/constants';
import * as uiActions from '../ui/actions';
import * as actions from './actions';
import { OperationStatus } from './constants';
import * as requests from './requests';
import * as selectors from './selectors';
import { makeLinkProps } from 'utils/uri';

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
    const items = yield call(requests.fetchShelves, { offset, limit, orderBy, orderDirection });
    yield put(actions.setShelves({ orderBy, orderDirection, page, items }));
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
  }
}

function* loadAllShelf() {
  const offset = 0;
  const limit = SHELVES_LIMIT;
  try {
    const items = yield call(requests.fetchShelves, { offset, limit });
    yield put(actions.setAllShelf({ items }));
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
    const { items, shelfInfo } = yield call(requests.fetchShelfBooks, { uuid, orderBy, offset, limit });
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

function* loadShelfAllBook({ payload }) {
  const { uuid } = payload;
  const limit = ITEMS_LIMIT_PER_SHELF;
  try {
    const { items } = yield call(requests.fetchShelfBooks, { uuid, limit });
    yield put(actions.setShelfAllBook(uuid, items));
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

function* createOperationSingleChunk(endpoint, ops) {
  while (true) {
    try {
      if (endpoint === OperationEndpoint.SHELF) {
        return yield call(requests.createOperationShelf, ops);
      }
      return yield call(requests.createOperationShelfItem, ops);
    } catch (err) {
      if (err.response) {
        const { status } = err.response;
        if (status === 403) {
          return ops.map(() => ({ id: null, status: OperationStatus.FORBIDDEN }));
        }
        if (status === 404) {
          return ops.map(() => ({ id: null, status: OperationStatus.FAILURE }));
        }
        // TODO: 던지지 말고 처리?
        throw err;
      }
      // 네트워크 에러 등, 재시도
    }
  }
}

function* createOperation(endpoint, ops) {
  if (ops.length === 0) {
    return [];
  }

  const revision = Math.floor(Date.now() / 1000);
  const opsWithRevision = ops.map(op => ({ ...op, revision }));
  yield put(actions.beginOperation({ revision }));

  let limit;
  if (endpoint === OperationEndpoint.SHELF) {
    limit = SHELF_OPERATION_LIMIT;
  } else {
    limit = SHELF_ITEM_OPERATION_LIMIT;
  }
  const chunks = arrayChunk(opsWithRevision, limit);

  try {
    const opResultsChunked = yield all(chunks.map(chunk => call(createOperationSingleChunk, endpoint, chunk)));
    const opResults = opResultsChunked.flat();
    return yield fork(waitForOperation, revision, opResults);
  } catch (err) {
    yield put(actions.endOperation({ revision, hasError: true }));
    throw err;
  }
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
      yield put(
        trackEvent({
          eventName: EventNames.MAKE_SHELF,
          trackingParams: {
            shelf_id: uuid,
          },
        }),
      );
      break;
    }
  }
  yield all([put(uiActions.setFullScreenLoading(false)), put(actions.loadShelfCount())]);
  if (pageOptions) {
    yield put(actions.loadShelves(pageOptions));
  }
}

function* loadAllShelfAfterAdd({ payload }) {
  yield call(addShelf, { payload });
  yield put(actions.loadAllShelf());
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
    yield all([
      put(actions.setShelfInfo({ uuid, name })),
      put(toastActions.showToast({ message: '책장 이름을 변경했습니다.' })),
      put(
        trackEvent({
          eventName: EventNames.MODIFY_SHELF_NAME,
        }),
      ),
    ]);
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
  try {
    yield all([
      put(uiActions.setFullScreenLoading(true)),
      put(selectionActions.clearSelectedItems()),
      call(performOperation, OperationType.DELETE_SHELF, ops),
    ]);
    yield all([
      put(
        toastActions.showToast({
          message: '책장을 삭제했습니다.',
        }),
      ),
      put(actions.loadShelves(pageOptions)),
      put(actions.loadShelfCount()),
      put(
        trackEvent({
          eventName: EventNames.DELETE_SHELF,
          trackingParams: {
            shelf_id: uuids,
          },
        }),
      ),
    ]);
  } catch (err) {
    yield put(
      toastActions.showToast({
        message: '책장을 삭제하는 중 오류가 발생했습니다.',
        toastStyle: ToastStyle.RED,
      }),
    );
  }
  yield put(uiActions.setFullScreenLoading(false));
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
  yield all([
    put(actions.loadShelfBookCount(uuid)),
    put(
      trackEvent({
        eventName: EventNames.ADD_BOOK,
        trackingParams: {
          book_id: ops.map(op => op.bookIds).flat(),
        },
      }),
    ),
  ]);
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
  yield all([
    put(actions.loadShelfBookCount(uuid)),
    put(
      trackEvent({
        eventName: EventNames.DELETE_BOOK,
        trackingParams: {
          book_id: ops.map(op => op.bookIds).flat(),
        },
      }),
    ),
  ]);
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
    put(
      trackEvent({
        eventName: EventNames.DELETE_SHELF,
        trackingParams: {
          shelf_id: uuid,
        },
      }),
    ),
  ]);
}

function* getUnitsFromLibraryBookData() {
  const selectedBooks = yield select(selectionSelectors.getSelectedItems);
  const bookIds = Object.entries(selectedBooks)
    .filter(([, selected]) => selected)
    .map(([key]) => key);
  const libraryBookData = yield call(bookRequests.fetchLibraryBookData, bookIds);
  const units = libraryBookData.items.map(book => ({
    unitId: book.search_unit_id,
    bookIds: [book.b_id],
  }));
  return units;
}

function* validateItemsLimitPerShelf({ itemsCount, uuid }) {
  let isValide = true;
  const count = yield call(requests.fetchShelfBookCount, { uuid });
  if (count + itemsCount > ITEMS_LIMIT_PER_SHELF) {
    yield put(
      toastActions.showToast({
        message: `최대 ${thousandsSeperator(ITEMS_LIMIT_PER_SHELF)}권까지 추가할 수 있습니다.`,
        toastStyle: ToastStyle.RED,
      }),
    );
    isValide = false;
  }
  return isValide;
}

function* addSelectedToShelf({ payload }) {
  yield put(uiActions.setFullScreenLoading(true));
  const { fromShelfPageOptions, onComplete, uuid } = payload;
  try {
    const units = yield call(getUnitsFromLibraryBookData);
    const isValid = yield call(validateItemsLimitPerShelf, {
      itemsCount: units.length,
      uuid,
    });
    if (isValid) {
      yield call(addShelfItem, { payload: { uuid, units } });
      yield call(loadShelfBooks, { payload: { uuid, ...fromShelfPageOptions } });
      yield put(
        toastActions.showToast({
          message: '선택한 책을 책장에 추가했습니다.',
        }),
      );

      onComplete && onComplete();
    }
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

function* getUnitsFromShelfItempMap() {
  const bookIds = Object.entries(yield select(selectionSelectors.getSelectedItems))
    .filter(([, checked]) => checked)
    .map(([bookId]) => bookId);
  const bookToUnit = yield select(state => state.shelf.bookToUnit);
  const itemMap = yield select(state => state.shelf.itemMap);
  const units = bookIds.map(bookId => {
    const unitId = bookToUnit[bookId];
    return itemMap[unitId];
  });
  return units;
}

function* removeSelectedFromShelf({ payload }) {
  const { uuid, pageOptions } = payload;
  const units = yield call(getUnitsFromShelfItempMap);
  try {
    yield all([
      put(uiActions.setFullScreenLoading(true)),
      put(selectionActions.clearSelectedItems()),
      call(deleteShelfItem, { payload: { uuid, units } }),
    ]);
    if (pageOptions) {
      yield call(loadShelfBooks, { payload: { uuid, ...pageOptions } });
      yield put(
        toastActions.showToast({
          message: '책장에서 삭제했습니다.',
        }),
      );
    }
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

function* moveSelectedBooks({ payload }) {
  const { uuid, pageOptions } = payload;
  yield put(uiActions.setFullScreenLoading(true));
  const [targetShelfUuids, units] = yield all([select(selectionSelectors.getSelectedShelfIds), call(getUnitsFromShelfItempMap)]);
  const isValid = yield call(validateItemsLimitPerShelf, {
    itemsCount: units.length,
    uuid,
  });
  try {
    if (isValid) {
      yield all(targetShelfUuids.map(targetShelfUuid => call(addShelfItem, { payload: { uuid: targetShelfUuid, units } })));
      yield call(deleteShelfItem, { payload: { uuid, units } });
      yield put(
        toastActions.showToast({
          message: '선택한 책을 이동했습니다.',
          linkName: '책장 바로가기',
          linkProps: makeLinkProps({}, URLMap[PageType.SHELF_DETAIL].as({ uuid: targetShelfUuids[0] })),
        }),
      );
    }
  } catch (error) {
    console.error(error);
    yield put(
      toastActions.showToast({
        message: '책을 이동하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        toastStyle: ToastStyle.RED,
      }),
    );
  } finally {
    yield all([
      put(selectionActions.clearSelectedShelves()),
      put(selectionActions.clearSelectedItems()),
      call(loadShelfBooks, {
        payload: {
          uuid,
          ...pageOptions,
          page: 1,
        },
      }),
    ]);
    yield put(uiActions.setFullScreenLoading(false));
  }
}

export default function* shelfRootSaga() {
  yield all([
    takeEvery(actions.LOAD_ALL_SHELF, loadAllShelf),
    takeEvery(actions.LOAD_ALL_SHELF_AFTER_ADD, loadAllShelfAfterAdd),
    takeEvery(actions.LOAD_SHELVES, loadShelves),
    takeEvery(actions.LOAD_SHELF_COUNT, loadShelfCount),
    takeEvery(actions.LOAD_SHELF_BOOKS, loadShelfBooks),
    takeEvery(actions.LOAD_SHELF_ALL_BOOK, loadShelfAllBook),
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
    takeEvery(actions.MOVE_SELECTED_BOOKS, moveSelectedBooks),
  ]);
}

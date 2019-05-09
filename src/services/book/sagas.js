import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { toFlatten } from '../../utils/array';
import Storage, { StorageKey } from '../../utils/storage';
import { getCriterion } from '../../utils/ttl';
import { showToast } from '../toast/actions';
import {
  LOAD_BOOK_DATA_FROM_STORAGE,
  setBookData,
  setBookDataFromStorage,
  setBookDescriptions,
  setBookStarRatings,
  setUnitData,
  setUnitOrders,
  SHOW_SHELF_BOOK_ALERT_TOAST,
} from './actions';
import { fetchBookData, fetchBookDescriptions, fetchStarRatings, fetchUnitData, fetchUnitOrders } from './requests';
import { getBooks } from './selectors';
import { ToastStyle, Duration } from '../toast/constants';

function* persistBookDataToStorage() {
  // Step 1. Select book data in redux store.
  // Step 2. Save to storage.
  const books = yield select(state => state.books.books);
  const units = yield select(state => state.books.units);
  Storage.save(StorageKey.BOOKS, books.toJSON());
  Storage.save(StorageKey.UNITS, units.toJSON());
}

function* loadBookDataFromStorage() {
  // Step 1. Load book data from storage
  // Step 2. Set book data
  const books = Storage.load(StorageKey.BOOKS);
  const units = Storage.load(StorageKey.UNITS);
  yield put(setBookDataFromStorage(books, units));
  yield fork(persistBookDataToStorage);
}

function filterTTLObj(itemIds, existItems) {
  // Step 1. Get exist ttl item data
  // Step 2. Filter expired or not cached ttl item data via payload
  // Step 3. Fetch ttl item data
  // Step 4. Set ttl item data
  const criterion = getCriterion();
  return itemIds.filter(itemId => {
    const item = existItems[itemId];
    // 없거나 TTL이 만료된 경우
    return !item || item.ttl <= criterion;
  });
}

export function* loadBookData(bookIds) {
  const existBooks = yield select(state => state.books.books);
  const filteredBookIds = filterTTLObj(bookIds, existBooks);
  // 빈 문자열, null, undefined 등의 값을 걸러냄
  const bookIdsWithoutInvalidValue = filteredBookIds.filter(Boolean);

  if (bookIdsWithoutInvalidValue.length === 0) {
    return;
  }

  const books = yield call(fetchBookData, bookIdsWithoutInvalidValue);
  yield put(setBookData(books));

  // TODO: 되살릴 타이밍 잡기 (LRU)
  // yield fork(persistBookDataToStorage);
}

export function* loadBookDescriptions(bookIds) {
  // Step 1. 시리즈도서인 경우 시리즈 ID 추출
  // 시리즈 도서의 경우 Description 을 시리즈 대표 도서로 노출해야 한다.
  yield call(loadBookData, bookIds);
  const books = yield select(getBooks, bookIds);
  const bookSeriesIds = toFlatten(Object.values(books), 'series.id', true);

  // Step 2. 요청할 Book id 를 추려낸다.
  // Book description 은 데이터 양이 많고, 상세 페이지 가야 필요한 데이터이기 때문에 storage 에 persist 하지 않는다.
  const existBookDescriptions = yield select(state => state.books.bookDescriptions);
  const filteredBookIds = filterTTLObj([...bookIds, ...bookSeriesIds], existBookDescriptions);
  // 빈 문자열, null, undefined 등의 값을 걸러냄
  const bookIdsWithoutInvalidValue = filteredBookIds.filter(Boolean);

  if (bookIdsWithoutInvalidValue.length === 0) {
    return;
  }

  // Step 3. 데이터 요청
  const bookDescriptions = yield call(fetchBookDescriptions, bookIdsWithoutInvalidValue);
  yield put(setBookDescriptions(bookDescriptions));
}

export function* loadBookStarRatings(bookIds) {
  const existStartRatings = yield select(state => state.books.bookStarRatings);
  const filteredBookIds = filterTTLObj(bookIds, existStartRatings);
  // 빈 문자열, null, undefined 등의 값을 걸러냄
  const bookIdsWithoutInvalidValue = filteredBookIds.filter(Boolean);

  if (bookIdsWithoutInvalidValue.length === 0) {
    return;
  }

  const starRatings = yield call(fetchStarRatings, bookIdsWithoutInvalidValue);
  yield put(setBookStarRatings(starRatings));
}

export function* loadUnitData(unitIds) {
  const existUnits = yield select(state => state.books.units);
  const filteredUnitIds = filterTTLObj(unitIds, existUnits);

  if (filteredUnitIds.length === 0) {
    return;
  }

  const units = yield call(fetchUnitData, filteredUnitIds);
  yield put(setUnitData(units));
}

export function* loadUnitOrders(unitId, orderType, orderBy, page) {
  const unitOrders = yield call(fetchUnitOrders, unitId, orderType, orderBy, page);
  yield put(setUnitOrders(unitId, orderType, orderBy, page, unitOrders));
}

export function* showShelfBookAlertToast() {
  yield put(
    showToast({
      message: '해당 도서는 상세페이지에서 선택할 수 있습니다.',
      toastStyle: ToastStyle.BLUE,
      withBottomFixedButton: true,
    }),
  );
}

export default function* bookRootSaga() {
  yield all([
    takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage),
    takeEvery(SHOW_SHELF_BOOK_ALERT_TOAST, showShelfBookAlertToast),
  ]);
}

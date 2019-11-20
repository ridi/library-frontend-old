import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';

import { toFlatten } from '../../utils/array';
import Storage, { StorageKey } from '../../utils/storage';
import { getCriterion } from '../../utils/ttl';
import {
  LOAD_BOOK_DATA,
  LOAD_BOOK_DATA_FROM_STORAGE,
  LOAD_UNIT_DATA,
  setBookData,
  setBookDataFromStorage,
  setBookDescriptions,
  setBookStarRatings,
  setOpenInfo,
  setUnitData,
  setUnitOrders,
} from './actions';
import { fetchBookData, fetchBookDescriptions, fetchBooksOpenInfo, fetchStarRatings, fetchUnitData, fetchUnitOrders } from './requests';
import { getBooks } from './selectors';

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

  const [books, openInfo] = yield all([
    call(fetchBookData, bookIdsWithoutInvalidValue),
    call(fetchBooksOpenInfo, bookIdsWithoutInvalidValue),
  ]);

  yield all([put(setBookData(books)), put(setOpenInfo(openInfo))]);

  // TODO: 되살릴 타이밍 잡기 (LRU)
  // yield fork(persistBookDataToStorage);
}

function* loadBookDataFromAction({ payload: { bookIds } }) {
  yield* loadBookData(bookIds);
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

function* loadUnitDataFromAction({ payload: { unitIds } }) {
  yield* loadUnitData(unitIds);
}

export function* loadUnitOrders(unitId, orderBy, orderDirection, page) {
  const unitOrders = yield call(fetchUnitOrders, unitId, orderBy, orderDirection, page);
  yield put(setUnitOrders(unitId, orderBy, orderDirection, page, unitOrders));
}

export default function* bookRootSaga() {
  yield all([
    takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage),
    takeEvery(LOAD_BOOK_DATA, loadBookDataFromAction),
    takeEvery(LOAD_UNIT_DATA, loadUnitDataFromAction),
  ]);
}

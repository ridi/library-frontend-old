import { all, call, put, select, takeEvery, fork } from 'redux-saga/effects';

import {
  LOAD_BOOK_DATA_FROM_STORAGE,
  setBookData,
  setBookDataFromStorage,
  setBookDescriptions,
  setUnitData,
  setBookStarRatings,
  setUnitOrders,
} from './actions';

import { fetchBookData, fetchUnitData, fetchBookDescriptions, fetchStarRatings, fetchUnitOrders } from './requests';

import Storage, { StorageKey } from '../../utils/storage';
import { getCriterion } from '../../utils/ttl';
import { getBooks } from './selectors';
import { toFlatten } from '../../utils/array';

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
  return itemIds.reduce((previous, itemId) => {
    const item = existItems.find(itemId);

    if (!item) {
      // 없거나
      return [...previous, itemId];
    }

    if (item.value.ttl <= criterion) {
      // TTL이 만료되었거나
      return [...previous, itemId];
    }

    return previous;
  }, []);
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

  // TODO: LRU버그로 인해 주석처리
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

  if (filteredBookIds.length === 0) {
    return;
  }

  // Step 3. 데이터 요청
  const bookDescriptions = yield call(fetchBookDescriptions, filteredBookIds);
  yield put(setBookDescriptions(bookDescriptions));
}

export function* loadBookStarRatings(bookIds) {
  const existStartRatings = yield select(state => state.books.bookStarRatings);
  const filteredBookIds = filterTTLObj(bookIds, existStartRatings);

  if (filteredBookIds.length === 0) {
    return;
  }

  const starRatings = yield call(fetchStarRatings, filteredBookIds);
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

export default function* bookRootSaga() {
  yield all([takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage)]);
}

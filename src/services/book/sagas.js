import { all, call, put, select, takeEvery, fork } from 'redux-saga/effects';

import { LOAD_BOOK_DATA_FROM_STORAGE, setBookData, setBookDataFromStorage, setUnitData } from './actions';

import { fetchBookData } from './requests';

import Storage, { StorageKey } from '../../utils/storage';
import { getCriterion, attatchTTL } from '../../utils/ttl';

function* persistBookDataToStorage() {
  // Step 1. Select book data in redux store.
  // Step 2. Save to storage.
  const books = yield select(state => state.books.books);
  const units = yield select(state => state.books.units);
  Storage.save(StorageKey.BOOKS, books.toJSON());
  Storage.save(StorageKey.units, units.toJSON());
}

function* loadBookDataFromStorage() {
  // Step 1. Load book data from storage
  // Step 2. Set book data
  const books = Storage.load(StorageKey.BOOKS);
  const units = Storage.load(StorageKey.UNITS);
  yield put(setBookDataFromStorage(books, units));
  yield fork(persistBookDataToStorage);
}

export function* loadBookData(bookIds) {
  // Step 1. Get exist book data
  // Step 2. Filter expired or not cached book data via payload.bookIds
  // Step 3. Fetch book data
  // Step 4. Set book data
  const criterion = getCriterion();
  const existBooks = yield select(state => state.books.books);
  const filteredBookIds = bookIds.reduce((previous, bookId) => {
    const book = existBooks.find(bookId);

    if (!book) {
      // 없거나
      return [...previous, bookId];
    }

    if (book.value.ttl <= criterion) {
      // TTL이 만료되었거나
      return [...previous, book.value.id];
    }

    return previous;
  }, []);

  if (filteredBookIds.length > 0) {
    const books = yield call(fetchBookData, filteredBookIds);
    yield put(setBookData(books));
    yield fork(persistBookDataToStorage);
  }
}

export function* saveUnitData(units) {
  const criterion = getCriterion();
  const existUnits = yield select(state => state.books.units);
  const filteredUnits = units.reduce((previous, unit) => {
    const _unit = existUnits.find(unit.id);

    if (!_unit) {
      return [...previous, unit];
    }

    if (_unit.value.ttl <= criterion) {
      return [...previous, unit];
    }

    return previous;
  }, []);

  yield put(setUnitData(attatchTTL(filteredUnits)));
  yield fork(persistBookDataToStorage);
}

export function* extractUnitData(items) {
  const units = items.map(item => ({
    id: item.unit_id,
    title: item.unit_title,
    type: item.unit_type,
    type_int: item.unit_type_int,
  }));

  yield call(saveUnitData, units);
}

export default function* bookRootSaga() {
  yield all([takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage)]);
}

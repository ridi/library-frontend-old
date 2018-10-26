import { all, call, put, select, takeEvery, fork } from 'redux-saga/effects';

import {
  LOAD_BOOK_DATA_FROM_STORAGE,
  setBookData,
  setBookDataFromStorage,
} from './actions';

import { fetchBookData } from './requests';

import Storage from '../../utils/storage';
import { getCriterion } from '../../utils/ttl';

function* persistBookDataToStorage() {
  // Step 1. Select book data in redux store.
  // Step 2. Save to storage.
  const books = yield select(state => state.books.books);
  Storage.save(books.toJSON());
}

function* loadBookDataFromStorage() {
  // Step 1. Load book data from storage
  // Step 2. Set book data
  const books = Storage.load();
  yield put(setBookDataFromStorage(books));
  yield fork(persistBookDataToStorage);
}

export function* loadBookData(bookIds) {
  // Step 1. Get exist book data
  // Step 2. Filter expired or not cached book data via payload.bookIds
  // Step 3. Fetch book data
  // Step 4. Set book data
  const criterion = getCriterion();
  const existbooks = yield select(state => state.books.books);
  const filteredBookIds = bookIds.reduce((previous, bookId) => {
    const book = existbooks.find(bookId);

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

export default function* bookRootSaga() {
  yield all([takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage)]);
}

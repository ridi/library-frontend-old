
import { all, call, put, select, takeEvery, fork } from 'redux-saga/effects';

import {
  LOAD_BOOK_DATA,
  LOAD_BOOK_DATA_FROM_STORAGE,

  setBookData,
  setBookDataFromStorage,
} from './actions';

import { fetchBookData } from './requests';

import Storage from '../../utils/storage';
import { getCriterion } from '../../utils/ttl';


function* loadBookData (action) {
  // Step 1. Get exist book data
  // Step 2. Filter expired or not cached book data via payload.bookIds
  // Step 3. Fetch book data
  // Step 4. Set book data
  const criterion = getCriterion();
  const books = yield select(state => state.books.books);
  const bookIds = action.payload.bookIds.map(bookId => {
    const book = books.find(bookId);

    if (!book) {
      // 없거나
      return bookId;
    }

    if (book.value.ttl <= criterion) {
      // TTL이 만료되었거나
      return book.value.id;
    }

    return;
  });

  if (bookIds.length > 0) {
    const books = yield call(fetchBookData, bookIds);
    yield put(setBookData(books));
    yield fork(persistBookDataToStorage);
  }
}


function* loadBookDataFromStorage () {
  // Step 1. Load book data from storage
  // Step 2. Set book data
  const books = Storage.load();
  yield put(setBookDataFromStorage(books));
  yield fork(persistBookDataToStorage);
}


function* persistBookDataToStorage () {
  // Step 1. Select book data in redux store.
  // Step 2. Save to storage.
  const books = yield select(state => state.books.books);
  Storage.save(books.toJSON());
}

export default function* bookRootSaga () {
  yield all([
    takeEvery(LOAD_BOOK_DATA, loadBookData),
    takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage),
  ]);
}


import { all, call, put, select, takeEvery, fork } from 'redux-saga/effects';

import {
  LOAD_BOOK_DATA,
  LOAD_BOOK_DATA_FROM_STORAGE,

  setBookData,
} from './actions';

import { fetchBookData } from './requests';

import Storage from '../../utils/storage';
import { getCriterion } from '../../utils/ttl';


function _getExpiredBookIds (targetBookIds, books, criterion) {
  return targetBookIds.reduce((previous, bookId) => {
    const book = books[bookId];

    if (!book) {
      return previous;
    }

    if (book.ttl > criterion) {
      return previous;
    }

    return [
      ...previous, book.id,
    ]
  }, []);
};


function _getNotExistBookIds (bookIds, existBooks) {
  return bookIds.reduce((previous, current) => {
    const existBook = existBooks[current];

    // 기존의 책이 없을때
    if (!existBook) {
      return [
        ...previous,
        current,
      ];
    }

    return previous;
  }, []);
}


function* loadBookData (action) {
  // Step 1. Get exist book data
  // Step 2. Filter expired or not cached book data via payload.bookIds
  // Step 3. Fetch book data
  // Step 4. Set book data

  const _bookIds = action.payload.bookIds;
  const criterion = getCriterion();
  const existBooks = yield select(state => state.books.books);

  const expiredBookIds = _getExpiredBookIds(_bookIds, existBooks, criterion);
  const notExistBookIds = _getNotExistBookIds(_bookIds, existBooks);

  const bookIds = [...expiredBookIds, ...notExistBookIds];
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
  yield put(setBookData(books));
  yield fork(persistBookDataToStorage);
}


function* persistBookDataToStorage () {
  // Step 1. Select book data in redux store.
  // Step 2. Save to storage.
  const books = yield select(state => state.books.books);
  Storage.save(books);
}


export default function* bookRootSaga () {
  yield all([
    takeEvery(LOAD_BOOK_DATA, loadBookData),
    takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage),
  ]);
}


import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_BOOK_DATA,
  LOAD_BOOK_DATA_FROM_STORAGE,
  PERSIST_BOOK_DATA_TO_STORAGE
} from './actions';

import { fetchBookData } from './requests';


function* loadBookData (action) {
  // Step 1. Fetch book data
  // Step 2. Set book data

  const books = yield call(fetchBookData, action.payload.bookIds);
  yield put(setBookData(books));
}


function* loadBookDataFromStorage () {
  // Step 1. Load book data from storage
  // Step 2. Set book data
}


function* watchPersistTimer () {
  // Step 1. Select book data in redux store.
  // Step 2. Save to storage.

  const books = yield select(state => state.books);
}

export default function* bookRootSaga () {
  yield all([
    takeEvery(LOAD_BOOK_DATA, loadBookData),
    takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage),
  ]);
}

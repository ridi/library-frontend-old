
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_BOOK_DATA_FROM_SERVER,
  LOAD_BOOK_DATA_FROM_STORAGE,
  PERSIST_BOOK_DATA_TO_STORAGE
} from './actions';


function* loadBookDataFromServer () {
  // Step 1. Fetch book data
  // Step 2. Set book data
  // Step 3. Call persist book data
}


function* loadBookDataFromStorage () {
  // Step 1. Load book data from storage
  // Step 2. Set book data
  // Step 3. Call persist book data
}


function* persistBookDataToStorage () {
  // Step 1. Select book data in redux store.
  // Step 2. Save to storage.
}

export default function* bookRootSaga () {
  yield all([
    takeEvery(LOAD_BOOK_DATA_FROM_SERVER, loadBookDataFromServer),
    takeEvery(LOAD_BOOK_DATA_FROM_STORAGE, loadBookDataFromStorage),
    takeEvery(PERSIST_BOOK_DATA_TO_STORAGE, persistBookDataToStorage)
  ]);
}

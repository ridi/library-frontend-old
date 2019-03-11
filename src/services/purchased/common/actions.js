export const SET_READ_LATEST_BOOK_ID = 'SET_READ_LATEST_BOOK_ID';
export const SET_LOADING_READ_LATEST = 'SET_LOADING_READ_LATEST';

export const LOAD_READ_LATEST_BOOK_ID = 'LOAD_READ_LATEST_BOOK_ID';

export const setReadLatestBookId = (unitId, bookId) => ({
  type: SET_READ_LATEST_BOOK_ID,
  payload: {
    unitId,
    bookId,
  },
});

export const setLoadingReadLatest = loadingReadLatest => ({
  type: SET_LOADING_READ_LATEST,
  payload: {
    loadingReadLatest,
  },
});

export const loadReadLatestBookId = (unitId, bookId) => ({
  type: LOAD_READ_LATEST_BOOK_ID,
  payload: {
    unitId,
    bookId,
  },
});

export const SET_READ_LATEST_BOOK_ID = 'SET_READ_LATEST_BOOK_ID';
export const SET_LOADING_READ_LATEST = 'SET_LOADING_READ_LATEST';

export const setReadLatestBookId = (unitId, readLatestBookId) => ({
  type: SET_READ_LATEST_BOOK_ID,
  payload: {
    unitId,
    readLatestBookId,
  },
});

export const setLoadingReadLatest = loadingReadLatest => ({
  type: SET_LOADING_READ_LATEST,
  payload: {
    loadingReadLatest,
  },
});

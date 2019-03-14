export const SET_READ_LATEST_BOOK_ID = 'SET_READ_LATEST_BOOK_ID';

export const HIDE_ALL_EXPIRED_BOOKS = 'HIDE_ALL_EXPIRED_BOOKS';

export const SET_FETCHING_READ_LATEST = 'SET_FETCHING_READ_LATEST';
export const SET_RECENTLY_UPDATED_DATA = 'SET_RECENTLY_UPDATED_DATA';
export const SET_PRIMARY_BOOK_ID = 'SET_PRIMARY_BOOK_ID';

export const setReadLatestBookId = (unitId, bookId) => ({
  type: SET_READ_LATEST_BOOK_ID,
  payload: {
    unitId,
    bookId,
  },
});

export const setFetchingReadLatest = fetchingReadLatest => ({
  type: SET_FETCHING_READ_LATEST,
  payload: {
    fetchingReadLatest,
  },
});

export const setRecentlyUpdatedData = recentlyUpdatedData => ({
  type: SET_RECENTLY_UPDATED_DATA,
  payload: {
    recentlyUpdatedData,
  },
});

export const hideAllExpiredBooks = () => ({
  type: HIDE_ALL_EXPIRED_BOOKS,
});

export const setPrimaryBookId = (unitId, primaryBookId) => ({
  type: SET_PRIMARY_BOOK_ID,
  payload: {
    unitId,
    primaryBookId,
  },
});

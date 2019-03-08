export const SET_READ_LATEST_BOOK_ID = 'SET_READ_LATEST_BOOK_ID';

export const setReadLatestBookId = (unitId, readLatestBookId) => ({
  type: SET_READ_LATEST_BOOK_ID,
  payload: {
    unitId,
    readLatestBookId,
  },
});

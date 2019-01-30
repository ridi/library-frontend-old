export const DOWNLOAD_BOOKS = 'DOWNLOAD_BOOKS';

export const downloadBooks = bookIds => ({
  type: DOWNLOAD_BOOKS,
  payload: {
    bookIds,
  },
});

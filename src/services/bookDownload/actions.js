export const DOWNLOAD_BOOKS = 'DOWNLOAD_BOOKS';
export const DOWNLOAD_BOOKS_BY_UNIT_IDS = 'DOWNLOAD_BOOKS_BY_UNIT_IDS';

export const downloadBooks = bookIds => ({
  type: DOWNLOAD_BOOKS,
  payload: {
    bookIds,
  },
});

export const downloadBooksByUnitIds = unitIds => ({
  type: DOWNLOAD_BOOKS_BY_UNIT_IDS,
  payload: {
    unitIds,
  },
});

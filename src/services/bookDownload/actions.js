export const DOWNLOAD_BOOKS = 'DOWNLOAD_BOOKS';
export const DOWNLOAD_SELECTED_BOOKS = 'DOWNLOAD_SELECTED_BOOKS';
export const DOWNLOAD_BOOKS_BY_UNIT_IDS = 'DOWNLOAD_BOOKS_BY_UNIT_IDS';
export const SET_BOOK_DOWNLOAD_SRC = 'SET_BOOK_DOWNLOAD_SRC';

export const downloadBooks = bookIds => ({
  type: DOWNLOAD_BOOKS,
  payload: {
    bookIds,
  },
});

export const downloadSelectedBooks = () => ({
  type: DOWNLOAD_SELECTED_BOOKS,
});

export const downloadBooksByUnitIds = unitIds => ({
  type: DOWNLOAD_BOOKS_BY_UNIT_IDS,
  payload: {
    unitIds,
  },
});

export const setBookDownloadSrc = src => ({
  type: SET_BOOK_DOWNLOAD_SRC,
  payload: {
    src,
  },
});

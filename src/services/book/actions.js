export const SET_BOOK_DATA = 'SET_BOOK_DATA';
export const SET_BOOK_DESCRIPTIONS = 'SET_BOOK_DESCRIPTIONS';
export const SET_BOOK_STAR_RATINGS = 'SET_BOOK_STAR_RATINGS';
export const SET_UNIT_DATA = 'SET_UNIT_DATA';
export const SET_UNIT_ORDERS = 'SET_UNIT_ORDERS';

export const SET_OPEN_INFO = 'SET_OPEN_INFO';

export const SET_BOOK_DATA_FROM_STORAGE = 'SET_BOOK_DATA_FROM_STORAGE';
export const LOAD_BOOK_DATA_FROM_STORAGE = 'LOAD_BOOK_DATA_FROM_STORAGE';

export const SHOW_SHELF_BOOK_ALERT_TOAST = 'SHOW_SHELF_BOOK_ALERT_TOAST';

export const LOAD_BOOK_DATA = 'LOAD_BOOK_DATA';
export const LOAD_UNIT_DATA = 'LOAD_UNIT_DATA';

export const makeUnitOrderKey = (unitId, orderBy, orderDirection, page) => `${unitId}-${orderBy}-${orderDirection}-${page}`;

export const setBookData = books => ({
  type: SET_BOOK_DATA,
  payload: {
    books,
  },
});

export const setOpenInfo = openInfo => ({
  type: SET_OPEN_INFO,
  payload: {
    openInfo,
  },
});

export const setBookDescriptions = bookDescriptions => ({
  type: SET_BOOK_DESCRIPTIONS,
  payload: {
    bookDescriptions,
  },
});

export const setBookStarRatings = bookStarRatings => ({
  type: SET_BOOK_STAR_RATINGS,
  payload: {
    bookStarRatings,
  },
});

export const setUnitData = units => ({
  type: SET_UNIT_DATA,
  payload: {
    units,
  },
});

export const setUnitOrders = (unitId, orderBy, orderDirection, page, unitOrders) => ({
  type: SET_UNIT_ORDERS,
  payload: {
    unitId,
    orderBy,
    orderDirection,
    page,
    unitOrders,
  },
});

export const setBookDataFromStorage = (books, units) => ({
  type: SET_BOOK_DATA_FROM_STORAGE,
  payload: {
    books,
    units,
  },
});

export const loadBookDataFromStorage = () => ({
  type: LOAD_BOOK_DATA_FROM_STORAGE,
});

export const loadBookData = bookIds => ({
  type: LOAD_BOOK_DATA,
  payload: {
    bookIds,
  },
});

export const loadUnitData = unitIds => ({
  type: LOAD_UNIT_DATA,
  payload: {
    unitIds,
  },
});

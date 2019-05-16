export const LOAD_SHELVES = 'LOAD_SHELVES';
export const LOAD_SHELF_COUNT = 'LOAD_SHELF_COUNT';
export const LOAD_SHELF_BOOKS = 'LOAD_SHELF_BOOKS';
export const LOAD_SHELF_BOOK_COUNT = 'LOAD_SHELF_BOOK_COUNT';

export const SET_SHELVES = 'SET_SHELVES';
export const SET_SHELF_COUNT = 'SET_SHELF_COUNT';
export const SET_SHELF_BOOKS = 'SET_SHELF_BOOKS';
export const SET_SHELF_BOOK_COUNT = 'SET_SHELF_BOOK_COUNT';

export const loadShelves = ({ orderBy, orderDirection, page }) => ({
  type: LOAD_SHELVES,
  payload: {
    orderBy,
    orderDirection,
    page,
  },
});

export const loadShelfCount = () => ({
  type: LOAD_SHELF_COUNT,
});

export const loadShelfBooks = (uuid, { orderBy, orderDirection, page }) => ({
  type: LOAD_SHELF_BOOKS,
  payload: {
    uuid,
    orderBy,
    orderDirection,
    page,
  },
});

export const loadShelfBookCount = uuid => ({
  type: LOAD_SHELF_BOOK_COUNT,
  payload: uuid,
});

/*
 * items: Array<{
 *   id: number,
 *   uuid: string,
 *   name: string,
 * }>
 * */
export const setShelves = ({ orderBy, orderDirection, page, items }) => ({
  type: SET_SHELVES,
  payload: {
    orderBy,
    orderDirection,
    page,
    items,
  },
});

export const setShelfCount = count => ({
  type: SET_SHELF_COUNT,
  payload: count,
});

/*
 * items: Array<{
 *   bookIds: Array<string>,
 *   unitId: number,
 * }>
 * */
export const setShelfBooks = (uuid, { orderBy, orderDirection, page, items }) => ({
  type: SET_SHELF_BOOKS,
  payload: {
    uuid,
    orderBy,
    orderDirection,
    page,
    items,
  },
});

export const setShelfBookCount = ({ uuid, count }) => ({
  type: SET_SHELF_BOOK_COUNT,
  payload: {
    uuid,
    count,
  },
});

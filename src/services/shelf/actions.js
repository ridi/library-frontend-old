export const LOAD_ALL_SHELF = 'LOAD_ALL_SHELF';
export const LOAD_ALL_SHELF_AFTER_ADD = 'LOAD_ALL_SHELF_AFTER_ADD';
export const LOAD_SHELVES = 'LOAD_SHELVES';
export const LOAD_SHELF_COUNT = 'LOAD_SHELF_COUNT';
export const LOAD_SHELF_BOOKS = 'LOAD_SHELF_BOOKS';
export const LOAD_SHELF_ALL_BOOK = 'LOAD_SHELF_ALL_BOOK';
export const LOAD_SHELF_BOOK_COUNT = 'LOAD_SHELF_BOOK_COUNT';
export const INVALIDATE_SHELF_PAGE = 'INVALIDATE_SHELF_PAGE';

export const SET_ALL_SHELF = 'SET_ALL_SHELF';
export const SET_SHELVES = 'SET_SHELVES';
export const SET_SHELF_INFO = 'SET_SHELF_INFO';
export const SET_SHELF_COUNT = 'SET_SHELF_COUNT';
export const SET_SHELF_BOOKS = 'SET_SHELF_BOOKS';
export const SET_SHELF_ALL_BOOK = 'SET_SHELF_ALL_BOOK';
export const SET_SHELF_BOOK_COUNT = 'SET_SHELF_BOOK_COUNT';

export const SET_LIBRARY_BOOKS = 'SET_LIBRARY_BOOKS';

export const ADD_SHELF = 'ADD_SHELF';
export const RENAME_SHELF = 'RENAME_SHELF';
export const DELETE_SHELF = 'DELETE_SHELF';
export const DELETE_SHELVES = 'DELETE_SHELVES';
export const ADD_SHELF_ITEM = 'ADD_SHELF_ITEM';
export const DELETE_SHELF_ITEM = 'DELETE_SHELF_ITEM';

export const VALIDATE_SHELVES_LIMIT = 'VALIDATE_SHELVES_LIMIT';

export const DELETE_SHELF_FROM_DETAIL = 'DELETE_SHELF_FROM_DETAIL';
export const ADD_SELECTED_TO_SHELF = 'ADD_SELECTED_TO_SHELF';
export const REMOVE_SELECTED_FROM_SHELF = 'REMOVE_SELECTED_FROM_SHELF';
export const DOWNLOAD_SELECTED_UNITS = 'DOWNLOAD_SELECTED_UNITS';

export const BEGIN_OPERATION = 'BEGIN_OPERATION';
export const END_OPERATION = 'END_OPERATION';

export const loadShelves = ({ orderBy, orderDirection, page }) => ({
  type: LOAD_SHELVES,
  payload: {
    orderBy,
    orderDirection,
    page,
  },
});

export const loadAllShelf = () => ({
  type: LOAD_ALL_SHELF,
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

export const loadShelfAllBook = uuid => ({
  type: LOAD_SHELF_ALL_BOOK,
  payload: {
    uuid,
  },
});

export const loadShelfBookCount = uuid => ({
  type: LOAD_SHELF_BOOK_COUNT,
  payload: {
    uuid,
  },
});

// 로딩 중 표시만 띄울 수 있게 하기 위함
export const invalidateShelfPage = (uuid, { orderBy, orderDirection, page }) => ({
  type: INVALIDATE_SHELF_PAGE,
  payload: {
    uuid,
    orderBy,
    orderDirection,
    page,
  },
});

export const setAllShelf = ({ items }) => ({
  type: SET_ALL_SHELF,
  payload: {
    items,
  },
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

export const setShelfInfo = ({ id, uuid, name }) => ({
  type: SET_SHELF_INFO,
  payload: {
    id,
    uuid,
    name,
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

export const setShelfAllBook = (uuid, items) => ({
  type: SET_SHELF_ALL_BOOK,
  payload: {
    uuid,
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

export const setLibraryBooks = books => ({
  type: SET_LIBRARY_BOOKS,
  payload: {
    books,
  },
});

export const addShelf = ({ name, pageOptions }) => ({
  type: ADD_SHELF,
  payload: {
    name,
    pageOptions,
  },
});

export const loadAllShelfAfterAdd = ({ name }) => ({
  type: LOAD_ALL_SHELF_AFTER_ADD,
  payload: {
    name,
  },
});

export const renameShelf = ({ uuid, name }) => ({
  type: RENAME_SHELF,
  payload: {
    uuid,
    name,
  },
});

export const deleteShelf = ({ uuid }) => ({
  type: DELETE_SHELF,
  payload: {
    uuid,
  },
});

export const deleteShelves = ({ uuids, pageOptions }) => ({
  type: DELETE_SHELVES,
  payload: {
    uuids,
    pageOptions,
  },
});

export const addShelfItem = ({ uuid, units }) => ({
  type: ADD_SHELF_ITEM,
  payload: {
    uuid,
    units,
  },
});

export const deleteShelfItem = ({ uuid, units }) => ({
  type: DELETE_SHELF_ITEM,
  payload: {
    uuid,
    units,
  },
});

export const deleteShelfFromDetail = (uuid, history) => ({
  type: DELETE_SHELF_FROM_DETAIL,
  payload: {
    history,
    uuid,
  },
});

export const addSelectedToShelf = ({ fromShelfPageOptions, onComplete, uuid }) => ({
  type: ADD_SELECTED_TO_SHELF,
  payload: {
    fromShelfPageOptions,
    onComplete,
    uuid,
  },
});

export const removeSelectedFromShelf = ({ uuid, pageOptions }) => ({
  type: REMOVE_SELECTED_FROM_SHELF,
  payload: {
    uuid,
    pageOptions,
  },
});

export const downloadSelectedUnits = () => ({
  type: DOWNLOAD_SELECTED_UNITS,
});

export const beginOperation = ({ revision }) => ({
  type: BEGIN_OPERATION,
  payload: {
    revision,
  },
});

export const endOperation = ({ revision, hasError }) => ({
  type: END_OPERATION,
  payload: {
    revision,
    hasError,
  },
});

export const validateShelvesLimit = ({ onValid, onInvalid }) => ({
  type: VALIDATE_SHELVES_LIMIT,
  payload: {
    onValid,
    onInvalid,
  },
});

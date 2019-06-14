export const LOAD_SHELVES = 'LOAD_SHELVES';
export const LOAD_SHELF_COUNT = 'LOAD_SHELF_COUNT';
export const LOAD_SHELF_BOOKS = 'LOAD_SHELF_BOOKS';
export const LOAD_SHELF_BOOK_COUNT = 'LOAD_SHELF_BOOK_COUNT';
export const INVALIDATE_SHELF_PAGE = 'INVALIDATE_SHELF_PAGE';

export const SET_SHELVES = 'SET_SHELVES';
export const SET_SHELF_INFO = 'SET_SHELF_INFO';
export const SET_SHELF_COUNT = 'SET_SHELF_COUNT';
export const SET_SHELF_BOOKS = 'SET_SHELF_BOOKS';
export const SET_SHELF_BOOK_COUNT = 'SET_SHELF_BOOK_COUNT';
export const SET_SHELF_LIST_PAGE_OPTIONS = 'SET_SHELF_LIST_PAGE_OPTIONS';
export const SET_SHELF_DETAIL_PAGE_OPTIONS = 'SET_SHELF_DETAIL_PAGE_OPTIONS';

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

export const setListPageOptions = ({ orderBy, orderDirection, page }) => ({
  type: SET_SHELF_LIST_PAGE_OPTIONS,
  payload: {
    orderBy,
    orderDirection,
    page,
  },
});

export const setDetailPageOptions = ({ orderBy, orderDirection, page }) => ({
  type: SET_SHELF_DETAIL_PAGE_OPTIONS,
  payload: {
    orderBy,
    orderDirection,
    page,
  },
});

export const addShelf = ({ name, pageOptions }) => ({
  type: ADD_SHELF,
  payload: {
    name,
    pageOptions,
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

export const deleteShelfFromDetail = uuid => ({
  type: DELETE_SHELF_FROM_DETAIL,
  payload: {
    uuid,
  },
});

export const addSelectedToShelf = ({ onComplete, uuid }) => ({
  type: ADD_SELECTED_TO_SHELF,
  payload: {
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

export const validateShelvesLimit = ({ valid, inValid }) => ({
  type: VALIDATE_SHELVES_LIMIT,
  payload: {
    valid,
    inValid,
  },
});

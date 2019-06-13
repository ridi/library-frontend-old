import produce from 'immer';

import {
  BEGIN_OPERATION,
  END_OPERATION,
  INVALIDATE_SHELF_PAGE,
  LOAD_SHELF_BOOK_COUNT,
  LOAD_SHELF_BOOKS,
  LOAD_SHELF_COUNT,
  LOAD_SHELVES,
  SET_LIBRARY_BOOKS,
  SET_SHELF_BOOK_COUNT,
  SET_SHELF_BOOKS,
  SET_SHELF_COUNT,
  SET_SHELF_INFO,
  SET_SHELF_DETAIL_PAGE_OPTIONS,
  SET_SHELF_LIST_PAGE_OPTIONS,
  SET_SHELVES,
} from './actions';

/*
 * {
 *   shelfCount: 1, // number | null
 *   shelves: {
 *     createdAt_desc_1: {
 *       loading: false,
 *       items: [
 *         '00000000-0000-0000-0000-000000000000',
 *       ]
 *     },
 *   },
 *   shelf: {
 *     '00000000-0000-0000-0000-000000000000': {
 *       id: 0,
 *       uuid: '00000000-0000-0000-0000-000000000000',
 *       name: 'Foo',
 *       bookCount: 4, // number | null
 *       books: {
 *         releasedAt_desc_1: {
 *           loading: false,
 *           items: [123, 456],
 *         },
 *         releasedAt_desc_2: {
 *           loading: false,
 *           items: [12, 34],
 *         },
 *       },
 *     },
 *   },
 *   itemMap: {
 *     '12': { bookIds: ['3'], unitId: 12 },
 *     '123': { bookIds: ['1'], unitId: 123 },
 *     '34': { bookIds: ['4'], unitId: 34 },
 *     '456': { bookIds: ['2'], unitId: 456 },
 *   },
 *   bookToUnit: {
 *     '1': 123,
 *     '2': 456,
 *     '3': 12,
 *     '4': 34,
 *   },
 *   libraryBooks: {
 *   },
 *   detailPageOptions: {
 *     orderBy: '',
 *     orderDirection: '',
 *     page: 2,
 *   }
 * }
 * */
const initialState = {
  syncStatus: {},
  shelfCount: null,
  shelves: {},
  shelf: {},
  itemMap: {},
  bookToUnit: {},
  libraryBooks: {},
  listPageOptions: {
    orderBy: '',
    orderDirection: '',
    page: 1,
  },
  detailPageOptions: {
    orderBy: '',
    orderDirection: '',
    page: 1,
  },
};

const makeBaseShelfData = uuid => ({
  id: 0,
  uuid,
  name: '',
  thumbnailIds: [],
  bookCount: null,
  books: {},
});

const shelfReducer = produce((draft, action) => {
  switch (action.type) {
    case BEGIN_OPERATION: {
      const { revision } = action.payload;
      draft.syncStatus[revision] = 'in-progress';
      break;
    }
    case END_OPERATION: {
      const { revision, hasError } = action.payload;
      draft.syncStatus[revision] = hasError ? 'error' : 'done';
      break;
    }
    case LOAD_SHELVES: {
      const { orderBy, orderDirection, page } = action.payload;
      const key = `${orderBy}_${orderDirection}_${page}`;
      if (draft.shelves[key] == null) {
        draft.shelves[key] = {
          loading: true,
          items: null,
        };
      }
      draft.shelves[key].loading = true;
      break;
    }
    case SET_SHELVES: {
      const { orderBy, orderDirection, page, items } = action.payload;
      draft.shelves[`${orderBy}_${orderDirection}_${page}`] = {
        loading: false,
        items: items.map(item => item.uuid),
      };

      for (const { id, uuid, name, thumbnails } of items) {
        if (draft.shelf[uuid] == null) {
          draft.shelf[uuid] = makeBaseShelfData(uuid);
        }
        draft.shelf[uuid].id = id;
        draft.shelf[uuid].name = name;
        draft.shelf[uuid].thumbnailIds = thumbnails ? thumbnails.map(thumbnail => thumbnail.b_ids[0]) : [];
      }
      break;
    }
    case SET_SHELF_INFO: {
      const { id, uuid, name } = action.payload;
      if (draft.shelf[uuid] == null) {
        draft.shelf[uuid] = makeBaseShelfData(uuid);
      }
      if (id != null) draft.shelf[uuid].id = id;
      if (name != null) draft.shelf[uuid].name = name;
      break;
    }
    case LOAD_SHELF_COUNT:
      draft.shelfCount = null;
      break;
    case SET_SHELF_COUNT:
      draft.shelfCount = action.payload;
      break;
    case LOAD_SHELF_BOOKS: {
      const { uuid, orderBy, orderDirection, page } = action.payload;
      const key = `${orderBy}_${orderDirection}_${page}`;
      if (draft.shelf[uuid] == null) {
        draft.shelf[uuid] = makeBaseShelfData(uuid);
      }
      if (draft.shelf[uuid].books[key] == null) {
        draft.shelf[uuid].books[key] = {
          loading: true,
          items: null,
        };
      } else {
        draft.shelf[uuid].books[key].loading = true;
      }
      break;
    }
    case SET_SHELF_BOOKS: {
      const { uuid, orderBy, orderDirection, page, items } = action.payload;
      if (draft.shelf[uuid] == null) {
        draft.shelf[uuid] = makeBaseShelfData(uuid);
      }
      draft.shelf[uuid].books[`${orderBy}_${orderDirection}_${page}`] = {
        loading: false,
        items: items.map(({ unitId }) => unitId),
      };
      for (const { bookIds, unitId } of items) {
        draft.itemMap[unitId] = { bookIds, unitId };
      }
      break;
    }
    case LOAD_SHELF_BOOK_COUNT: {
      const uuid = action.payload;
      if (draft.shelf[uuid] == null) {
        draft.shelf[uuid] = makeBaseShelfData(uuid);
      }
      draft.shelf[uuid].bookCount = null;
      break;
    }
    case SET_SHELF_BOOK_COUNT: {
      const { uuid, count } = action.payload;
      if (draft.shelf[uuid] == null) {
        draft.shelf[uuid] = makeBaseShelfData(uuid);
      }
      draft.shelf[uuid].bookCount = count;
      break;
    }
    case INVALIDATE_SHELF_PAGE: {
      const { uuid, orderBy, orderDirection, page } = action.payload;
      const key = `${orderBy}_${orderDirection}_${page}`;
      if (draft.shelf[uuid] == null) {
        draft.shelf[uuid] = makeBaseShelfData(uuid);
      }
      draft.shelf[uuid].books[key] = {
        loading: true,
        items: null,
      };
      break;
    }
    case SET_LIBRARY_BOOKS: {
      const { books } = action.payload;
      for (const book of books) {
        draft.libraryBooks[book.unit_id] = book;
        draft.bookToUnit[book.b_id] = book.unit_id;
      }
      break;
    }
    case SET_SHELF_LIST_PAGE_OPTIONS: {
      const { orderBy, orderDirection, page } = action.payload;
      draft.listPageOptions.orderBy = orderBy;
      draft.listPageOptions.orderDirection = orderDirection;
      draft.listPageOptions.page = page;
      break;
    }
    case SET_SHELF_DETAIL_PAGE_OPTIONS: {
      const { orderBy, orderDirection, page } = action.payload;
      draft.detailPageOptions.orderBy = orderBy;
      draft.detailPageOptions.orderDirection = orderDirection;
      draft.detailPageOptions.page = page;
      break;
    }
    default:
      break;
  }
}, initialState);

export default shelfReducer;

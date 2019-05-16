import produce from 'immer';

import {
  LOAD_SHELF_BOOK_COUNT,
  LOAD_SHELF_BOOKS,
  LOAD_SHELF_COUNT,
  LOAD_SHELVES,
  SET_SHELF_BOOK_COUNT,
  SET_SHELF_BOOKS,
  SET_SHELF_COUNT,
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
 *           items: [
 *             { bookIds: ['1'], unitId: 123 },
 *             { bookIds: ['2'], unitId: 456 },
 *           ],
 *         },
 *         releasedAt_desc_2: {
 *           loading: false,
 *           items: [
 *             { bookIds: ['3'], unitId: 12 },
 *             { bookIds: ['4'], unitId: 34 },
 *           ],
 *         },
 *       },
 *     },
 *   },
 * }
 * */
const initialState = {
  shelfCount: null,
  shelves: {},
  shelf: {},
};

const makeBaseShelfData = uuid => ({
  id: 0,
  uuid,
  name: '',
  bookCount: null,
  books: {},
});

const shelfReducer = produce((draft, action) => {
  switch (action.type) {
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
      for (const { id, uuid, name } of items) {
        if (draft.shelf[uuid] == null) {
          draft.shelf[uuid] = makeBaseShelfData(uuid);
        }
        draft.shelf[uuid].id = id;
        draft.shelf[uuid].name = name;
      }
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
        items,
      };
      break;
    }
    case LOAD_SHELF_BOOK_COUNT: {
      const { uuid } = action.payload;
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
    default:
      break;
  }
}, initialState);

export default shelfReducer;

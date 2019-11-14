import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';

/*
 * getShelves(
 *   state: State,
 *   options: {
 *     orderBy: string;
 *     orderDirection: string;
 *     page: number;
 *   },
 * ): { loading: boolean; items: Array<string> | null }
 *
 * loading: false, items: null이면 로드 필요
 * */
export const getShelves = createSelector(
  state => state.shelf.shelves,
  (_, { orderBy }) => orderBy,
  (_, { orderDirection }) => orderDirection,
  (_, { page }) => page,
  (shelves, orderBy, orderDirection, page) => shelves[`${orderBy}_${orderDirection}_${page}`] || { loading: false, items: null },
);

// getShelfCount(state: State): number | null
// 로드 중이면 null
export const getShelfCount = state => state.shelf.shelfCount;

// getShelfName(state: State, uuid: string): string | null
// 로드 중이거나 책장이 없으면 null
export const getShelfName = createCachedSelector(
  state => state.shelf.shelf,
  (_, uuid) => uuid,
  (shelf, uuid) => (shelf[uuid] == null ? null : shelf[uuid].name),
)((_, uuid) => uuid);

// getShelfThumbnailIds(state: State, uuid: string): array | null
// 로드 중이거나 책장이 없으면 null
export const getShelfThumbnailIds = createCachedSelector(
  state => state.shelf.shelf,
  (_, uuid) => uuid,
  (shelf, uuid) => (shelf[uuid] == null ? null : shelf[uuid].thumbnailIds),
)((_, uuid) => uuid);

// getShelfBookCount(state: State, uuid: string): number | null
// 로드 중이거나 책장이 없으면 null
export const getShelfBookCount = createCachedSelector(
  state => state.shelf.shelf,
  (_, uuid) => uuid,
  (shelf, uuid) => (shelf[uuid] == null ? null : shelf[uuid].bookCount),
)((_, uuid) => uuid);

/*
 * getShelfBooks(
 *   state: State,
 *   uuid: string,
 *   options: {
 *     orderBy: string;
 *     orderDirection: string;
 *     page: number;
 *   },
 * ): {
 *   loading: boolean;
 *   items: Array<number> | null;
 * }
 *
 * loading: false, items: null이면 로드 필요
 * */
export const getShelfBooks = createCachedSelector(
  state => state.shelf.shelf,
  (_, uuid) => uuid,
  (_, __, { orderType }) => orderType,
  (_, __, { orderBy }) => orderBy,
  (_, __, { orderDirection }) => orderDirection,
  (_, __, { page }) => page,
  (shelf, uuid, orderType, orderBy, orderDirection, page) => {
    const target = shelf[uuid];
    if (target == null) {
      return { loading: false, items: null };
    }
    return target.books[`${orderBy}_${orderType}_${orderDirection}_${page}`] || { loading: false, items: null };
  },
)((_, uuid) => uuid);

export const getIsShelfLoading = createCachedSelector(getShelfBooks, ({ loading }) => loading)((_, uuid) => uuid);

export const getShelfItems = createCachedSelector(getShelfBooks, ({ items }) => items)((_, uuid) => uuid);

export const getBookIds = createCachedSelector(
  state => state.shelf.libraryBooks,
  getShelfItems,
  (libraryBooks, items) => (items == null ? [] : items.map(item => libraryBooks[item]?.b_id)),
)((_, uuid) => uuid);

export const getLibraryBooks = createCachedSelector(
  state => state.shelf.libraryBooks,
  state => state.shelf.itemMap,
  getShelfItems,
  (libraryBooks, itemMap, items) =>
    items &&
    items.map(
      unitId =>
        libraryBooks[unitId] || {
          unit_count: itemMap[unitId].bookIds.length,
          is_ridiselect: false,
          b_id: itemMap[unitId].bookIds[0],
          purchase_date: new Date(0),
          unit_id: unitId,
        },
    ),
)((_, uuid) => uuid);

// getIsSyncInProgress(state: State): boolean
export const getIsSyncInProgress = createSelector(
  state => state.shelf.syncStatus,
  syncStatus => Object.values(syncStatus).some(status => status === 'in-progress'),
);

// getIsSyncHasError(state: State): boolean
export const getIsSyncHasError = createSelector(
  state => state.shelf.syncStatus,
  syncStatus => Object.values(syncStatus).some(status => status === 'error'),
);

import { loadUserInfo, startAccountTracker } from '../services/account/actions';
import { loadBookDataFromStorage } from '../services/book/actions';

import LRUCache from '../utils/lru';

const beforeCreatingStore = (initialState, context) => {
  const bookCache = new LRUCache(500);
  if (initialState.books) {
    bookCache.assign(initialState.books.books);
  }
  console.log(bookCache);

  return {
    ...initialState,
    books: {
      books: bookCache,
    },
  };
};

const afterCreatingStore = async (store, context) => {
  // General
  await store.dispatch(loadUserInfo());

  // Client Only
  if (!context.isServer) {
    await store.dispatch(loadBookDataFromStorage());
    await store.dispatch(startAccountTracker());
  }
};

export default {
  beforeCreatingStore,
  afterCreatingStore,
};

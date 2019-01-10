import { loadUserInfo, startAccountTracker } from '../services/account/actions';
import { loadBookDataFromStorage } from '../services/book/actions';

import LRUCache from '../utils/lru';
import { locationFromUrl } from '../services/router/utils';

const beforeCreatingStore = (initialState, context) => {
  const newInitialState = {
    ...initialState,
    books: {
      units: new LRUCache(200),
      books: new LRUCache(500),
    },
  };

  if (initialState.books) {
    newInitialState.books.books.assign(initialState.books.books);
    newInitialState.books.units.assign(initialState.books.units);
  }

  if (context.isServer) {
    newInitialState.router = {
      beforeLocation: null,
      location: locationFromUrl(context.asPath),
    };
  }

  return newInitialState;
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

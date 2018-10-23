
import { loadUserInfo } from '../services/account/actions';

import { loadBookDataFromStorage } from '../services/book/actions';

import LRUCache from '../utils/lru';


const beforeCreatingStore = (initialState, context) => {
  const books = {};
  if (!initialState.books) {
    books.books = new LRUCache(500);
  } else {
    books.books = new LRUCache(500, initialState.books.books);
  }

  return {
    ...initialState,
    books,
  };
}

const afterCreatingStore = async (store, context) => {
  if (!context.isServer) {
    await store.dispatch(loadUserInfo());
    await store.dispatch(loadBookDataFromStorage());
  }
};

export default {
  beforeCreatingStore,
  afterCreatingStore
};

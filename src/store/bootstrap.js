
import { loadUserInfo } from '../services/account/actions';

import { loadBookDataFromStorage, loadBookData } from '../services/book/actions';

import LRUCache from '../utils/lru';


const beforeCreatingStore = (initialState, context) => {
  const _state = { ...initialState };

  if (!_state.books) {
    _state.books = {
      books: new LRUCache(500),
    };
  } else {
    const lruCache = new LRUCache(500, _state.books.books);
    _state.books.books = lruCache;
  }

  return _state;
}

const afterCreatingStore = async (store, context) => {

  if (!context.isServer) {
    await store.dispatch(loadUserInfo());
    await store.dispatch(loadBookDataFromStorage());
  }
  await store.dispatch(loadBookData([102066210, 1534064409]));
};

export default {
  beforeCreatingStore,
  afterCreatingStore
};

// import nookies from 'nookies/src';
import { loadUserInfo, startAccountTracker } from '../services/account/actions';
// import { loadBookDataFromStorage } from '../services/book/actions';
// import { SET_VIEW_TYPE } from '../services/ui/actions';

import LRUCache from '../utils/lru';
import { locationFromUrl } from '../services/router/utils';

const beforeCreatingStore = (initialState, context) => {
  const newInitialState = {
    ...initialState,
    books: {
      units: new LRUCache(200000),
      bookDescriptions: new LRUCache(200000),
      bookStarRatings: new LRUCache(200000),
      books: new LRUCache(200000),
    },
  };

  if (initialState.books) {
    newInitialState.books.books.assign(initialState.books.books);
    newInitialState.books.bookDescriptions.assign(initialState.books.bookDescriptions);
    newInitialState.books.bookStarRatings.assign(initialState.books.bookStarRatings);
    newInitialState.books.units.assign(initialState.books.units);
  }

  if (context.isServer) {
    newInitialState.router = {
      beforeLocation: null,
      location: locationFromUrl(context.asPath),
    };
  }

  // TODO: SSR Disable로 인해 제거
  // Cookie로 부터 데이터 로드
  // const cookies = nookies.get(context);
  // if (cookies[SET_VIEW_TYPE]) {
  //   newInitialState.ui = {
  //     viewType: cookies[SET_VIEW_TYPE],
  //   };
  // }

  return newInitialState;
};

const afterCreatingStore = async (store, context) => {
  // General
  await store.dispatch(loadUserInfo());

  // Client Only
  if (!context.isServer) {
    // TODO: LRU버그로 인해 주석처리
    // await store.dispatch(loadBookDataFromStorage());
    await store.dispatch(startAccountTracker());
  }
};

export default {
  beforeCreatingStore,
  afterCreatingStore,
};

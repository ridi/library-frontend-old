import nookies from 'nookies';
import { loadUserInfo, startAccountTracker } from '../services/account/actions';

import { SET_VIEW_TYPE } from '../services/ui/actions';

import LRUCache from '../utils/lru';
import { locationFromUrl } from '../services/router/utils';
import config from '../config';

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

  // Local 개발 서버의 경우 NextJS 서버를 그대로 사용한다.
  // 해당 로직을 Client Only로 실행할 경우 서버에서는 Portrait 기반으로 DOM을 내려준다.
  // 만약 Client Cookie에 Landscape로 설정되어 있는 경우
  // hydrate로 인해 Portrait과 Landscape의 혼종이 발생한다.
  if (!context.isServer || config.ENVIRONMENT === 'local') {
    // Cookie로 부터 데이터 로드
    const cookies = nookies.get(context);
    if (cookies[SET_VIEW_TYPE]) {
      newInitialState.ui = {
        ...newInitialState.ui,
        viewType: cookies[SET_VIEW_TYPE],
      };
    }
  }

  return newInitialState;
};

const afterCreatingStore = async (store, context) => {
  // General

  // Client Only
  if (!context.isServer) {
    // 클라에서 userInfo 셋팅
    await store.dispatch(loadUserInfo());

    // TODO: LRU버그로 인해 주석처리
    // await store.dispatch(loadBookDataFromStorage());
    await store.dispatch(startAccountTracker());
  }
};

export default {
  beforeCreatingStore,
  afterCreatingStore,
};

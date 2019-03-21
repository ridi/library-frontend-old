import { loadActualPage } from '../services/common/actions';
import { startAccountTracker } from '../services/account/actions';
import LRUCache from '../utils/lru';
import { locationFromUrl } from '../services/router/utils';
import config from '../config';
import settings from '../utils/settings';

const beforeCreatingStore = (initialState, context) => {
  const newInitialState = {
    ...initialState,
    books: {
      units: new LRUCache(200000),
      bookDescriptions: new LRUCache(200000),
      bookStarRatings: new LRUCache(200000),
      books: new LRUCache(200000),
      unitOrders: new LRUCache(200000),
    },
  };

  if (initialState.books) {
    newInitialState.books.books.assign(initialState.books.books);
    newInitialState.books.bookDescriptions.assign(initialState.books.bookDescriptions);
    newInitialState.books.bookStarRatings.assign(initialState.books.bookStarRatings);
    newInitialState.books.units.assign(initialState.books.units);
    newInitialState.books.unitOrders.assign(initialState.books.unitOrders);
  }

  if (context.isServer) {
    newInitialState.router = {
      beforeLocation: null,
      location: locationFromUrl(context.asPath),
    };
  }

  // TODO: SSR Enable할때 아래 조건문 제거
  // Local 개발 서버의 경우 NextJS 서버를 그대로 사용한다.
  // 해당 로직을 Client Only로 실행할 경우 서버에서는 Portrait 기반으로 DOM을 내려준다.
  // 만약 Client Cookie에 Landscape로 설정되어 있는 경우
  // hydrate로 인해 Portrait과 Landscape의 혼종이 발생한다.
  if (!context.isServer || config.ENVIRONMENT === 'local') {
    // Cookie로 부터 데이터 로드
    const viewType = settings.viewType;
    if (viewType) {
      newInitialState.ui = {
        ...newInitialState.ui,
        viewType,
      };
    }
  }

  return newInitialState;
};

const afterCreatingStore = async (store, context) => {
  // General

  // Client Only
  if (!context.isServer) {
    await store.dispatch(loadActualPage());

    // TODO: LRU버그로 인해 주석처리
    // await store.dispatch(loadBookDataFromStorage());
    await store.dispatch(startAccountTracker());
  }
};

export default {
  beforeCreatingStore,
  afterCreatingStore,
};

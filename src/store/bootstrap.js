
import { loadUserInfo } from '../services/account/actions';

import { loadBookDataFromStorage } from '../services/book/actions';


const beforeCreatingStore = (initialState, context) => {
  const _state = { ...initialState };

  return _state;
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

import Window, { LOCAL_STORAGE } from './window';

const STORAGE_KEY_PREFIX = 'library.web';

const makeKey = key => `${STORAGE_KEY_PREFIX}.${key}`;

export const StorageKey = {
  BOOKS: 'books',
  UNITS: 'units',
};

export default {
  load: key => {
    const _key = makeKey(key);
    const storage = Window.get(LOCAL_STORAGE);
    if (!storage) {
      return [];
    }

    const data = storage.getItem(_key);
    if (!data) {
      return [];
    }

    return JSON.parse(data);
  },
  save: (key, state) => {
    const _key = makeKey(key);
    const storage = Window.get(LOCAL_STORAGE);
    if (!storage) {
      return;
    }

    try {
      storage.setItem(_key, JSON.stringify(state));
    } catch (e) {
      storage.removeItem(_key);
    }
  },
};

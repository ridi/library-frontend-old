import Window, { LOCAL_STORAGE } from './window';

const STORAGE_KEY = 'library.books';

export default {
  load: () => {
    const storage = Window.get(LOCAL_STORAGE);
    if (!storage) {
      return [];
    }

    const data = storage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    return JSON.parse(data);
  },
  save: state => {
    const storage = Window.get(LOCAL_STORAGE);
    if (!storage) {
      return;
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      storage.removeItem(STORAGE_KEY);
    }
  },
};

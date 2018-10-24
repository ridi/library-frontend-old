import Window from './window';

const LOCAL_STORAGE_KEY = 'library.books';

export default {
  load: () => {
    const storage = Window.get('localStorage');
    if (!storage) {
      return [];
    }

    const data = storage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      return [];
    }

    return JSON.parse(data);
  },
  save: state => {
    const storage = Window.get('localStorage');
    if (!storage) {
      return;
    }

    try {
      storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      storage.removeItem(LOCAL_STORAGE_KEY);
    }
  },
};

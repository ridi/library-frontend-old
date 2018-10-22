
const LOCAL_STORAGE_KEY = 'library.books';

export default {
  load: () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      return {};
    }

    return JSON.parse(data);
  },
  save: state => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }  catch(e) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  },
};

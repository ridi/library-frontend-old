
const LOCAL_STORAGE_KEY = 'library.books';

export default {
  load: () => {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      return [];
    }

    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      return [];
    }

    return JSON.parse(data);
  },
  save: state => {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      return;
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }  catch(e) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  },
};

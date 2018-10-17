
const LOCAL_STORAGE_KEY = 'library.books';

const localStorage = (() => ({
  load: () => {},
  save: state => {},
  clear: () => {},
}))();

export default localStorage;
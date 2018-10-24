import { SET_BOOK_DATA, SET_BOOK_DATA_FROM_STORAGE } from './actions';

const makeEntries = books => books.map(book => ({ key: book.id, value: book }));
const compareWithTTL = (oldValue, newValue) => oldValue.ttl < newValue.ttl;

const bookReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_BOOK_DATA:
      state.books.merge(makeEntries(action.payload.books), compareWithTTL);
      return state;
    case SET_BOOK_DATA_FROM_STORAGE:
      state.books.assign(action.payload.books, compareWithTTL, true);
      return state;
    default:
      return state;
  }
};

export default bookReducer;

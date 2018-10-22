
import { SET_BOOK_DATA } from './actions';

const initialState = {
  books: {},
};


const _mergeBooks = (existedBooks, newBooks) => {
  const books = {
    ...existedBooks,
  };

  Object.keys(newBooks).forEach(value => {
    const existedBook = books[value];
    const newBook = newBooks[value];
    if (existedBook) {
      // TTL 비교 후 새로운 데이터가 더 크면 새로운 데이터로 교체
      if (existedBook.ttl < newBook.ttl) {
        books[newBook.id] = newBook;
      }
    } else {
      books[newBook.id] = newBook;
    }
  });
  return books;
};

const bookReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_BOOK_DATA:
      return {
        books: _mergeBooks(state.books, action.payload.books),
      };
    default:
      return state;
  }
}

export default bookReducer;


import { SET_BOOK_DATA } from './actions';

import { getNow } from '../../utils/ttl';


const initialState = {
  books: {},
};


const _mergeBooks = (existedBooks, newBooks) => {
  const now = getNow();
  const reducedBooks = Object.keys(existedBooks).reduce((previous, current) => {
    const existedBook = existedBooks[current];

    // TTL이 초과한 데이터 제거
    if (existedBook.ttl < now) {
      return previous;
    }

    return {
      ...previous,
      [existedBook.id]: existedBook,
    }
  }, {});

  const reducedNewBooks = Object.keys(newBooks).reduce((previous, current) => {
    const existedBook = reducedBooks[current];
    const newBook = newBooks[current];

    if (existedBook && existedBook.ttl >= newBook.ttl) {
      return previous
    }

    return {
      ...previous,
      [newBook.id]: newBook,
    }
  }, {});

  return { ...reducedBooks, ...reducedNewBooks };
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

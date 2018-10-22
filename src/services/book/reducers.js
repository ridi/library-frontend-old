
import { SET_BOOK_DATA } from './actions';


const initialState = {
  books: {},
};

const _mergeBooks = (existBooks, newBooks) => {
  const reducedNewBooks = Object.keys(newBooks).reduce((previous, current) => {
    const existBook = existBooks[current];
    const newBook = newBooks[current];

    if (existBook && existBook.ttl >= newBook.ttl) {
      return previous
    }

    return {
      ...previous,
      [newBook.id]: newBook,
    }
  }, {});

  return { ...existBooks, ...reducedNewBooks };
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

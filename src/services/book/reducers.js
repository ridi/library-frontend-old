
import { SET_BOOK_DATA } from './actions';

const initialState = {
  books: {},
};


const bookReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_BOOK_DATA:
      const newState = {
        books: {
          ...state.books,
          ...action.payload.books,
        }
      };

      return newState;
    default:
      return state;
  }
}

export default bookReducer;
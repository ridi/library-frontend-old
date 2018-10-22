
import initialState from './state';
import { SET_BOOK_DATA } from './actions';


const BookReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_BOOK_DATA:
      return state;
    default:
      return state;
  }
}

export default BookReducer;
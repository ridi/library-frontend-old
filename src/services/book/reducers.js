
import initialState from './state';
import { SAVE_BOOK_DATA } from './actions';


const BookReducer = (state = initialState, action) => {
  switch(action.type) {
    case SAVE_BOOK_DATA:
      pass
    default:
      return state
  }
}

export default BookReducer;
import { SET_READ_LATEST_BOOK_ID } from './actions';

const purchasedCommonReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_READ_LATEST_BOOK_ID:
      return {
        ...state,
        bookReadLatests: {
          ...state.bookReadLatests,
          [action.payload.unitId]: action.payload.bookId,
        },
      };
    default:
      return state;
  }
};

export default purchasedCommonReducer;

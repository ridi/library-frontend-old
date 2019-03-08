import { SET_READ_LATEST_BOOK_ID } from './actions';

const initializeState = {
  readLatestBookIds: {},
};

const purchasedCommonReducer = (state = initializeState, action) => {
  switch (action.type) {
    case SET_READ_LATEST_BOOK_ID:
      return {
        ...state,
        readLatestBookIds: {
          ...state.readLatestBookIds,
          [action.payload.unitId]: action.payload.bookId,
        },
      };
    default:
      return state;
  }
};

export default purchasedCommonReducer;

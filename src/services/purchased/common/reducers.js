import { SET_READ_LATEST_BOOK_ID, SET_LOADING_READ_LATEST } from './actions';

const initializeState = {
  readLatestBookIds: {},
  loadingReadLatest: false,
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
    case SET_LOADING_READ_LATEST:
      return {
        ...state,
        loadingReadLatest: action.payload.loadingReadLatest,
      };
    default:
      return state;
  }
};

export default purchasedCommonReducer;

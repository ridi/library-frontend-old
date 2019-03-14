import { SET_READ_LATEST_BOOK_ID, SET_RECENTLY_UPDATED_DATA, SET_FETCHING_READ_LATEST, SET_PRIMARY_BOOK_ID } from './actions';

const initializeState = {
  readLatestBookIds: {},
  recentlyUpdatedData: {},
  primaryBookIds: {},
  fetchingReadLatest: false,
};

const purchasedCommonReducer = (state = initializeState, action) => {
  switch (action.type) {
    case SET_READ_LATEST_BOOK_ID:
      return {
        ...state,
        readLatestBookIds: {
          ...state.readLatestBookIds,
          [action.payload.unitId]: { loaded: true, bookId: action.payload.bookId },
        },
      };
    case SET_FETCHING_READ_LATEST:
      return {
        ...state,
        fetchingReadLatest: action.payload.fetchingReadLatest,
      };
    case SET_RECENTLY_UPDATED_DATA:
      return {
        ...state,
        recentlyUpdatedData: {
          ...state.recentlyUpdatedData,
          ...action.payload.recentlyUpdatedData,
        },
      };
    case SET_PRIMARY_BOOK_ID:
      return {
        ...state,
        primaryBookIds: {
          ...state.primaryBookIds,
          [state.unitId]: action.payload.primaryBookId,
        },
      };
    default:
      return state;
  }
};

export default purchasedCommonReducer;

import { SET_READ_LATEST_BOOK_ID, SET_LOADING_READ_LATEST, SET_RECENTLY_UPDATED_DATA } from './actions';

const initializeState = {
  readLatestBookIds: {},
  recentlyUpdatedData: {},
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
    case SET_RECENTLY_UPDATED_DATA:
      return {
        ...state,
        recentlyUpdatedData: {
          ...state.recentlyUpdatedData,
          ...action.payload.recentlyUpdatedData,
        },
      };
    default:
      return state;
  }
};

export default purchasedCommonReducer;

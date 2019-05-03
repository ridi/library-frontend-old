import produce from 'immer';
import { SET_FETCHING_READ_LATEST, SET_PRIMARY_BOOK_ID, SET_READ_LATEST_BOOK_ID, SET_RECENTLY_UPDATED_DATA } from './actions';

const initializeState = {
  readLatestBookIds: {},
  fetchingReadLatest: false,
  recentlyUpdatedData: {},
  primaryBookIds: {},
};

const purchasedCommonReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_READ_LATEST_BOOK_ID:
      draft.readLatestBookIds[action.payload.unitId] = { loaded: true, bookId: action.payload.bookId };
      break;
    case SET_FETCHING_READ_LATEST:
      draft.fetchingReadLatest = action.payload.fetchingReadLatest;
      break;
    case SET_RECENTLY_UPDATED_DATA:
      draft.recentlyUpdatedData = { ...draft.recentlyUpdatedData, ...action.payload.recentlyUpdatedData };
      break;
    case SET_PRIMARY_BOOK_ID:
      draft.primaryBookIds[action.payload.unitId] = action.payload.primaryBookId;
      break;
    default:
      break;
  }
}, initializeState);

export default purchasedCommonReducer;

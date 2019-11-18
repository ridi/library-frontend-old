import produce from 'immer';

import { toDict, toFlatten } from '../../utils/array';
import {
  SET_SERIAL_IS_FETCHING_BOOKS,
  SET_SERIAL_PREFERENCE_ITEMS,
  SET_SERIAL_PREFERENCE_TOTAL_COUNT,
  SET_SERIAL_UNIT_ID_MAP,
} from './actions';
import { createInitialDataState, getKey, initialState } from './state';

const serialPreferenceReducer = produce((draft, action) => {
  const key = getKey(draft);
  if (draft.data[key] == null) {
    draft.data[key] = createInitialDataState();
  }
  switch (action.type) {
    case SET_SERIAL_PREFERENCE_ITEMS:
      draft.data[key].items = {
        ...draft.data[key].items,
        ...toDict(action.payload.items, 'series_id'),
      };
      draft.data[key].itemIdsForPage[action.payload.page] = toFlatten(action.payload.items, 'series_id');
      break;
    case SET_SERIAL_PREFERENCE_TOTAL_COUNT:
      draft.data[key].totalCount = action.payload.totalCount;
      break;
    case SET_SERIAL_UNIT_ID_MAP:
      draft.unitIdMap = {
        ...draft.unitIdMap,
        ...action.payload.unitIdMap,
      };
      break;
    case SET_SERIAL_IS_FETCHING_BOOKS:
      draft.isFetchingBooks = action.payload.isFetchingBooks;
      break;
    default:
      break;
  }
}, initialState);

export default serialPreferenceReducer;

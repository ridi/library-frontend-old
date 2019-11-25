import produce from 'immer';

import { CLEAR_SELECTED_ITEMS, UNSELECT_ITEMS, SELECT_ITEMS, TOGGLE_ITEM } from './actions';

const initialState = {
  ids: {},
};

const selectionReducer = produce((draft, action) => {
  switch (action.type) {
    case SELECT_ITEMS:
      action.payload.forEach(id => {
        draft.ids[id] = true;
      });
      break;
    case UNSELECT_ITEMS:
      if (draft.ids[action.payload]) {
        delete draft.ids[action.payload];
      }
      break;
    case TOGGLE_ITEM:
      if (draft.ids[action.payload]) {
        delete draft.ids[action.payload];
      } else {
        draft.ids[action.payload] = true;
      }
      break;
    case CLEAR_SELECTED_ITEMS:
      if (Object.keys(draft.ids).length !== 0) {
        draft.ids = {};
      }
      break;
    default:
      break;
  }
  return draft;
}, initialState);

export default selectionReducer;

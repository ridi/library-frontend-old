import produce from 'immer';

import { SELECT_ITEMS, TOGGLE_ITEM, CLEAR_SELECTED_ITEMS } from './actions';

const initialState = {
  ids: {},
};

const selectionReducer = produce((draft, action) => {
  switch (action.type) {
    case SELECT_ITEMS:
      draft.ids = Object.fromEntries(action.payload.map(id => [id, true]));
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

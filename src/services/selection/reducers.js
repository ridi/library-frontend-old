import produce from 'immer';

import { SELECT_ITEMS, TOGGLE_ITEM, CLEAR_SELECTED_ITEMS } from './actions';

const initialState = {};

const selectionReducer = produce((draft, action) => {
  switch (action.type) {
    case SELECT_ITEMS:
      return action.payload.reduce((previous, id) => {
        previous[id] = 1;
        return previous;
      }, {});
    case TOGGLE_ITEM:
      if (draft[action.payload]) {
        delete draft[action.payload];
      } else {
        draft[action.payload] = true;
      }
      break;
    case CLEAR_SELECTED_ITEMS:
      if (Object.keys(draft).length !== 0) {
        return {};
      }
      break;
    default:
      break;
  }
  return draft;
}, initialState);

export default selectionReducer;

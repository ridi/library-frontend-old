import produce from 'immer';

import { SELECT_BOOKS, TOGGLE_BOOK, CLEAR_SELECTED_BOOKS } from './actions';

const initialState = {};

const selectionReducer = produce((draft, action) => {
  switch (action.type) {
    case SELECT_BOOKS:
      return action.payload.reduce((previous, bookId) => {
        previous[bookId] = 1;
        return previous;
      }, {});
    case TOGGLE_BOOK:
      if (draft[action.payload]) {
        delete draft[action.payload];
      } else {
        draft[action.payload] = true;
      }
      break;
    case CLEAR_SELECTED_BOOKS:
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

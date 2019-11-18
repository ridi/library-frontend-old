import produce from 'immer';

import { SET_BOOK_DOWNLOAD_SRC } from './actions';
import { initialState } from './state';

const bookDownloadReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_BOOK_DOWNLOAD_SRC:
      draft.src = action.payload.src;
      break;
    default:
      break;
  }
}, initialState);

export default bookDownloadReducer;

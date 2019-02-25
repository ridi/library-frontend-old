import { SET_BOOK_DOWNLOAD_SRC } from './actions';
import { initialState } from './state';

const bookDownloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOOK_DOWNLOAD_SRC:
      return { ...state, src: action.payload.src };
    default:
      return state;
  }
};

export default bookDownloadReducer;


import { SET_SHOWS } from '../actions';

const initialState = {
  shows: [],
};

const showsReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_SHOWS:
      return {
        ...state,
        shows: action.payload.shows,
      };
    default:
      return state;
  }
};

export default showsReducer;

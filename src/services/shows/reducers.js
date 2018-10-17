
import { SET_SHOWS } from '../../actions';
import initialState from './state';

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

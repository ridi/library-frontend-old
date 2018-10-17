import { combineReducers } from 'redux';
import showsReducer from '../services/shows/reducers';

export default combineReducers({
  shows: showsReducer,
});

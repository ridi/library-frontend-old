import { combineReducers } from 'redux';

import showsReducer from '../services/shows/reducers';
import accountReducer from '../services/account/reducers';


export default combineReducers({
  shows: showsReducer,
  account: accountReducer,
});

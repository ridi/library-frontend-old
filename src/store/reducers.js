import { combineReducers } from 'redux';

import showsReducer from '../services/shows/reducers';
import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import purchaseReducer from '../services/purchase/reducers';

import routerReducer from '../services/router/reducers';

export default combineReducers({
  shows: showsReducer,
  account: accountReducer,
  books: bookReducer,
  purchase: purchaseReducer,

  router: routerReducer,
});

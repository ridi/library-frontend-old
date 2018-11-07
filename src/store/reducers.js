import { combineReducers } from 'redux';

import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import purchaseReducer from '../services/purchase/reducers';
import purchasedUnitReducer from '../services/purchased/unit/reducers';

import routerReducer from '../services/router/reducers';

export default combineReducers({
  account: accountReducer,
  books: bookReducer,
  purchase: purchaseReducer,
  purchasedUnit: purchasedUnitReducer,

  router: routerReducer,
});

import { combineReducers } from 'redux';

import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import purchaseReducer from '../services/purchase/reducers';
import purchaseHiddenReducer from '../services/purchased/hidden/reducers';
import purchasedUnitReducer from '../services/purchased/mainUnit/reducers';

import routerReducer from '../services/router/reducers';

export default combineReducers({
  account: accountReducer,
  books: bookReducer,
  purchase: purchaseReducer,
  purchaseHidden: purchaseHiddenReducer,
  purchasedUnit: purchasedUnitReducer,

  router: routerReducer,
});

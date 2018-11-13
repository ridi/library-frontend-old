import { combineReducers } from 'redux';

import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import purchasedMainReducer from '../services/purchased/main/reducers';
import purchasedSearchReducer from '../services/purchased/search/reducers';
import purchasedHiddenReducer from '../services/purchased/hidden/reducers';
import purchasedUnitReducer from '../services/purchased/mainUnit/reducers';

import routerReducer from '../services/router/reducers';

export default combineReducers({
  account: accountReducer,
  books: bookReducer,
  purchasedMain: purchasedMainReducer,
  purchasedSearch: purchasedSearchReducer,
  purchasedHidden: purchasedHiddenReducer,
  purchasedUnit: purchasedUnitReducer,

  router: routerReducer,
});

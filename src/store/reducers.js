import { combineReducers } from 'redux';

import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import purchasedMainReducer from '../services/purchased/main/reducers';
import purchasedMainUnitReducer from '../services/purchased/mainUnit/reducers';
import purchasedSearchReducer from '../services/purchased/search/reducers';
import purchasedSearchUnitReducer from '../services/purchased/searchUnit/reducers';
import purchasedHiddenReducer from '../services/purchased/hidden/reducers';

import routerReducer from '../services/router/reducers';
import toastReducer from '../services/toast/reducers';

export default combineReducers({
  account: accountReducer,
  books: bookReducer,

  purchasedMain: purchasedMainReducer,
  purchasedMainUnit: purchasedMainUnitReducer,
  purchasedSearch: purchasedSearchReducer,
  purchasedSearchUnit: purchasedSearchUnitReducer,
  purchasedHidden: purchasedHiddenReducer,

  router: routerReducer,
  toast: toastReducer,
});

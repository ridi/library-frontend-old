import { combineReducers } from 'redux';

import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import excelDownloadReducer from '../services/excelDownload/reducers';
import purchasedMainReducer from '../services/purchased/main/reducers';
import purchasedMainUnitReducer from '../services/purchased/mainUnit/reducers';
import purchasedSearchReducer from '../services/purchased/search/reducers';
import purchasedSearchUnitReducer from '../services/purchased/searchUnit/reducers';
import purchasedHiddenReducer from '../services/purchased/hidden/reducers';
import purchasedHiddenUnitReducer from '../services/purchased/hiddenUnit/reducers';

import routerReducer from '../services/router/reducers';
import toastReducer from '../services/toast/reducers';
import viewTypeReducer from '../services/viewType/reducers';
import fullScreenLoadingReducer from '../services/fullScreenLoading/reducers';

export default combineReducers({
  account: accountReducer,
  books: bookReducer,

  purchasedMain: purchasedMainReducer,
  purchasedMainUnit: purchasedMainUnitReducer,
  purchasedSearch: purchasedSearchReducer,
  purchasedSearchUnit: purchasedSearchUnitReducer,
  purchasedHidden: purchasedHiddenReducer,
  purchasedHiddenUnit: purchasedHiddenUnitReducer,

  excelDownload: excelDownloadReducer,

  router: routerReducer,
  toast: toastReducer,
  viewType: viewTypeReducer,
  fullScreenLoading: fullScreenLoadingReducer,
});

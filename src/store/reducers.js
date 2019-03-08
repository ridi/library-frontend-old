import { combineReducers } from 'redux';
import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import bookDownloadReducer from '../services/bookDownload/reducers';
import confirmReducer from '../services/confirm/reducers';
import dialogReducer from '../services/dialog/reducers';
import excelDownloadReducer from '../services/excelDownload/reducers';
import purchaseCommonReducer from '../services/purchased/common/reducers';
import purchasedHiddenReducer from '../services/purchased/hidden/reducers';
import purchasedHiddenUnitReducer from '../services/purchased/hiddenUnit/reducers';
import purchasedMainReducer from '../services/purchased/main/reducers';
import purchasedMainUnitReducer from '../services/purchased/mainUnit/reducers';
import purchasedSearchReducer from '../services/purchased/search/reducers';
import purchasedSearchUnitReducer from '../services/purchased/searchUnit/reducers';
import routerReducer from '../services/router/reducers';
import serialPreferenceReducer from '../services/serialPreference/reducers';
import toastReducer from '../services/toast/reducers';
import uiReducer from '../services/ui/reducers';

export default combineReducers({
  account: accountReducer,
  books: bookReducer,

  purchaseCommon: purchaseCommonReducer,
  purchasedMain: purchasedMainReducer,
  purchasedMainUnit: purchasedMainUnitReducer,
  purchasedSearch: purchasedSearchReducer,
  purchasedSearchUnit: purchasedSearchUnitReducer,
  purchasedHidden: purchasedHiddenReducer,
  purchasedHiddenUnit: purchasedHiddenUnitReducer,

  serialPreference: serialPreferenceReducer,

  excelDownload: excelDownloadReducer,
  bookDownload: bookDownloadReducer,

  router: routerReducer,
  toast: toastReducer,
  confirm: confirmReducer,
  dialog: dialogReducer,
  ui: uiReducer,
});

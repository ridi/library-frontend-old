import { combineReducers } from 'redux';

import accountReducer from '../services/account/reducers';
import bookReducer from '../services/book/reducers';
import bookDownloadReducer from '../services/bookDownload/reducers';
import confirmReducer from '../services/confirm/reducers';
import dialogReducer from '../services/dialog/reducers';
import excelDownloadReducer from '../services/excelDownload/reducers';
// import featureReducer from '../services/feature/reducers';
import maintenanceReducer from '../services/maintenance/reducers';
import promptReducer from '../services/prompt/reducers';
import purchasedCommonReducer from '../services/purchased/common/reducers';
import filterReducer from '../services/purchased/filter/reducers';
import purchasedHiddenReducer from '../services/purchased/hidden/reducers';
import purchasedMainReducer from '../services/purchased/main/reducers';
import selectionReducer from '../services/selection/reducers';
import serialPreferenceReducer from '../services/serialPreference/reducers';
import shelfReducer from '../services/shelf/reducers';
import toastReducer from '../services/toast/reducers';
import uiReducer from '../services/ui/reducers';
import unitPageReducer from '../services/unitPage/reducers';

export default combineReducers({
  account: accountReducer,
  books: bookReducer,
  selection: selectionReducer,
  // feature: featureReducer,

  purchasedCommon: purchasedCommonReducer,
  filter: filterReducer,
  purchasedMain: purchasedMainReducer,
  purchasedHidden: purchasedHiddenReducer,
  unitPage: unitPageReducer,

  serialPreference: serialPreferenceReducer,
  shelf: shelfReducer,

  excelDownload: excelDownloadReducer,
  bookDownload: bookDownloadReducer,

  maintenance: maintenanceReducer,

  toast: toastReducer,
  confirm: confirmReducer,
  dialog: dialogReducer,
  prompt: promptReducer,
  ui: uiReducer,
});

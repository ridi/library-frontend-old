import { SET_EXCEL_DOWNLOAD_STATUS } from './actions';
import { initialState } from './state';

const excelDownloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXCEL_DOWNLOAD_STATUS:
      return {
        ...state,
        isExcelDownloading: action.payload.isDownloading,
      };
    default:
      return state;
  }
};

export default excelDownloadReducer;

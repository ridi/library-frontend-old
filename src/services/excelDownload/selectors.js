import { createSelector } from 'reselect';

const getState = state => state.excelDownload;

export const getIsExcelDownloading = createSelector(getState, state => state.isExcelDownloading);

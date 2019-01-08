export const START_EXCEL_DOWNLOAD = 'START_EXCEL_DOWNLOAD';
export const SET_EXCEL_DOWNLOAD_STATUS = 'SET_EXCEL_DOWNLOAD_STATUS';

export const startExcelDownload = () => ({
  type: START_EXCEL_DOWNLOAD,
});

export const setExcelDownloadStatus = isDownloading => ({
  type: SET_EXCEL_DOWNLOAD_STATUS,
  payload: {
    isDownloading,
  },
});

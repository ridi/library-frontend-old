import { all, call, delay, put, takeEvery } from 'redux-saga/effects';
import { downloadFile } from '../../utils/file';
import { setExcelDownloadStatus, START_EXCEL_DOWNLOAD } from './actions';
import { CHECK_EXCEL_DOWNLOAD_STATUS_RETRY_DELAY, EXCEL_FILE_NAME, ExcelDownloadStatusCode } from './constants';
import { fetchCheckExcelDownload, fetchStartExcelDownload } from './requests';

function* requestExcelDownloadUrl() {
  const itemResponse = yield call(fetchStartExcelDownload);
  const queueId = itemResponse.id;

  while (true) {
    const response = yield call(fetchCheckExcelDownload, queueId);
    switch (response.state) {
      case ExcelDownloadStatusCode.UNDONE:
        yield delay(CHECK_EXCEL_DOWNLOAD_STATUS_RETRY_DELAY);
        break;

      case ExcelDownloadStatusCode.FAIL:
        throw Error('Fail excel download error');

      case ExcelDownloadStatusCode.DONE:
        return response.file_download_url;

      default:
        throw Error('Not implemented error');
    }
  }
}

function* startExcelDownload() {
  const beforePageUnloadEventFunc = beforeunloadEvent => {
    const beforeunloadMessage = '아직 Excel 다운로드가 진행 중입니다. 페이지를 벗어나시겠습니까?';
    beforeunloadEvent.preventDefault();
    beforeunloadEvent.returnValue = beforeunloadMessage;
    return beforeunloadMessage;
  };

  yield put(setExcelDownloadStatus(true));
  window.addEventListener('beforeunload', beforePageUnloadEventFunc);

  let downloadUrl = '';
  try {
    downloadUrl = yield call(requestExcelDownloadUrl);
  } catch (e) {
    alert('Excel 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    return;
  } finally {
    window.removeEventListener('beforeunload', beforePageUnloadEventFunc);
    yield put(setExcelDownloadStatus(false));
  }

  // 여기서 파일이름을 지정하지만, 응답헤더의 filename 을 우선한다.
  downloadFile(downloadUrl, EXCEL_FILE_NAME);
}

export default function* excelDownloadRootSaga() {
  yield all([takeEvery(START_EXCEL_DOWNLOAD, startExcelDownload)]);
}

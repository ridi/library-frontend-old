import { delay } from 'redux-saga';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { downloadFile } from '../../utils/file';
import { addBeforeunloadEventListener, getBeforePageUnloadEventFunc, removeBeforeunloadEventListener } from '../../utils/window';
import { setExcelDownloadStatus, START_EXCEL_DOWNLOAD } from './actions';
import { CHECK_EXCEL_DOWNLOAD_STATUS_RETRY_DELAY, EXCEL_FILE_NAME, ExcelDownloadStatusCode } from './constants';
import { fetchCheckExcelDownload, fetchStartExcelDownload } from './requests';

function* startExcelDownload() {
  const beforePageUnloadEventFunc = getBeforePageUnloadEventFunc('아직 Excel 다운로드가 진행 중입니다. 페이지를 벗어나시겠습니까?');

  yield put(setExcelDownloadStatus(true));
  addBeforeunloadEventListener(beforePageUnloadEventFunc);

  let downloadUrl = '';
  try {
    downloadUrl = yield call(requestExcelDownloadUrl);
  } catch (e) {
    alert('Excel 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    return;
  } finally {
    removeBeforeunloadEventListener(beforePageUnloadEventFunc);
    yield put(setExcelDownloadStatus(false));
  }

  // 여기서 파일이름을 지정하지만, 응답헤더의 filename 을 우선한다.
  downloadFile(downloadUrl, EXCEL_FILE_NAME);
}

function* requestExcelDownloadUrl() {
  const itemResponse = yield call(fetchStartExcelDownload);
  const queue_id = itemResponse.id;

  while (true) {
    const response = yield call(fetchCheckExcelDownload, queue_id);
    switch (response.state) {
      case ExcelDownloadStatusCode.UNDONE:
        yield call(delay, CHECK_EXCEL_DOWNLOAD_STATUS_RETRY_DELAY);
        continue;

      case ExcelDownloadStatusCode.FAIL:
        throw Error('Fail excel download error');

      case ExcelDownloadStatusCode.DONE:
        return response.file_download_url;

      default:
        throw Error('Not implemented error');
    }
  }
}

export default function* excelDownloadRootSaga() {
  yield all([takeEvery(START_EXCEL_DOWNLOAD, startExcelDownload)]);
}

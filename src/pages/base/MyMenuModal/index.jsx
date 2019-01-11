/** @jsx jsx */
import { jsx } from '@emotion/core';
import config from '../../../config';
import * as styles from './styles';
import { Hidden } from '../../../styles';
import Download from '../../../svgs/Download.svg';
import Logout from '../../../svgs/Logout.svg';
import Note from '../../../svgs/Note.svg';
import Review from '../../../svgs/Review.svg';
import Spinner from '../../../svgs/Spinner.svg';

const ExcelDownLoadButton = dispatchStartExcelDownload => (
  <button type="button" css={styles.menuButton} onClick={() => dispatchStartExcelDownload()}>
    <Download css={styles.menuIcon} />
    구매 목록 엑셀 다운로드
  </button>
);

const ExcelDownLoadingButton = () => (
  <span css={styles.menuButton}>
    <Spinner css={styles.excelDownloading} />
  </span>
);

const MyMenuModal = ({ userId, isActive, isExcelDownloading, dispatchStartExcelDownload }) => (
  <section css={styles.myMenuModal(isActive)}>
    <h2 css={Hidden}>마이메뉴</h2>
    <div css={styles.menuList}>
      <p css={styles.userId}>
        <strong>{userId}</strong> 님
      </p>
    </div>
    <div css={styles.menuList}>
      <ul>
        <li>
          <a css={styles.menuButton} target="_blank" rel="noopener noreferrer" href={config.READING_NOTE_URL}>
            <Note css={styles.menuIcon} />
            독서노트
          </a>
        </li>
        <li>
          <a css={styles.menuButton} target="_blank" rel="noopener noreferrer" href={config.REVIEW_URL}>
            <Review css={styles.menuIcon} />내 리뷰 관리
          </a>
        </li>
      </ul>
    </div>
    <div css={styles.menuList}>
      <ul>
        <li>{isExcelDownloading ? ExcelDownLoadingButton() : ExcelDownLoadButton(dispatchStartExcelDownload)}</li>
      </ul>
    </div>
    <div css={styles.menuList}>
      <a css={styles.menuButton} href={config.LOGOUT_URL}>
        <Logout css={styles.menuIcon} />
        로그아웃
      </a>
    </div>
  </section>
);

export default MyMenuModal;

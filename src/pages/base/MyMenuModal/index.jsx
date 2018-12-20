/** @jsx jsx */
import { jsx } from '@emotion/core';
import config from '../../../config';
import * as styles from './styles';
import { Hidden } from '../../../styles';
import Download from '../../../svgs/Download.svg';
import Logout from '../../../svgs/Logout.svg';
import Note from '../../../svgs/Note.svg';
import Review from '../../../svgs/Review.svg';

const MyMenuModal = ({ userId, isActive }) => (
  <section css={styles.myMenuModal(isActive)}>
    <h2 css={Hidden}>마이메뉴</h2>
    <div css={styles.menuItem}>
      <p css={styles.userId}>
        <strong>{userId}</strong> 님
      </p>
    </div>
    <ul css={styles.menuList}>
      <li css={styles.menuItem}>
        <a css={styles.menuButton} type="button" target="_blank" href={config.READING_NOTE_URL}>
          <Note css={styles.menuIcon} />
          독서노트
        </a>
      </li>
      <li css={styles.menuItem}>
        <a css={styles.menuButton} type="button" target="_blank" href={config.REVIEW_URL}>
          <Review css={styles.menuIcon} />내 리뷰 관리
        </a>
      </li>
    </ul>
    <ul css={styles.menuList}>
      <li css={styles.menuItem}>
        <a css={styles.menuButton} type="button">
          <Download css={styles.menuIcon} />
          구매 목록 엑셀 다운로드
        </a>
      </li>
    </ul>
    <div css={styles.menuItem}>
      <a css={styles.menuButton} type="button" href={config.LOGOUT_URL}>
        <Logout css={styles.menuIcon} />
        로그아웃
      </a>
    </div>
  </section>
);

export default MyMenuModal;

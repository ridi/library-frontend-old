/** @jsx jsx */
import { jsx } from '@emotion/core';
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
        <button css={styles.menuButton} type="button">
          <Note css={styles.menuIcon} />
          독서노트
        </button>
      </li>
      <li css={styles.menuItem}>
        <button css={styles.menuButton} type="button">
          <Review css={styles.menuIcon} />내 리뷰 관리
        </button>
      </li>
    </ul>
    <ul css={styles.menuList}>
      <li css={styles.menuItem}>
        <button css={styles.menuButton} type="button">
          <Download css={styles.menuIcon} />
          구매 목록 엑셀 다운로드
        </button>
      </li>
    </ul>
    <div css={styles.menuItem}>
      <button css={styles.menuButton} type="button">
        <Logout css={styles.menuIcon} />
        로그아웃
      </button>
    </div>
  </section>
);

export default MyMenuModal;

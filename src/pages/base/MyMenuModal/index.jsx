/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { Hidden } from '../../../styles';
import Download from '../../../svgs/Download.svg';
import Logout from '../../../svgs/Logout.svg';
import Note from '../../../svgs/Note.svg';
import Review from '../../../svgs/Review.svg';

const MyMenuModal = ({ userId, isActive }) => (
  <section css={styles.MyMenuModal(isActive)}>
    <h2 css={Hidden}>마이메뉴</h2>
    <div css={styles.MenuItem}>
      <p css={styles.UserId}>
        <strong>{userId}</strong> 님
      </p>
    </div>
    <ul css={styles.MenuList}>
      <li css={styles.MenuItem}>
        <button css={styles.MenuButton} type="button">
          <Note css={styles.MenuIcon} />
          독서노트
        </button>
      </li>
      <li css={styles.MenuItem}>
        <button css={styles.MenuButton} type="button">
          <Review css={styles.MenuIcon} />내 리뷰 관리
        </button>
      </li>
    </ul>
    <ul css={styles.MenuList}>
      <li css={styles.MenuItem}>
        <button css={styles.MenuButton} type="button">
          <Download css={styles.MenuIcon} />
          구매 목록 엑셀 다운로드
        </button>
      </li>
    </ul>
    <div css={styles.MenuItem}>
      <button css={styles.MenuButton} type="button">
        <Logout css={styles.MenuIcon} />
        로그아웃
      </button>
    </div>
  </section>
);

export default MyMenuModal;

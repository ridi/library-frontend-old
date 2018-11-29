import React from 'react';
import * as styles from './styles';
import { Hidden } from '../../../styles';
import Download from '../../../svgs/Download.svg';
import Logout from '../../../svgs/Logout.svg';
import Note from '../../../svgs/Note.svg';
import Review from '../../../svgs/Review.svg';

const MyMenuModal = ({ userId, isActive }) => (
  <section className={styles.MyMenuModal(isActive)}>
    <h2 className={Hidden}>마이메뉴</h2>
    <div className={styles.MenuItem}>
      <p className={styles.UserId}>
        <strong>{userId}</strong> 님
      </p>
    </div>
    <ul className={styles.MenuList}>
      <li className={styles.MenuItem}>
        <button className={styles.MenuButton} type="button">
          <Note className={styles.MenuIcon} />
          독서노트
        </button>
      </li>
      <li className={styles.MenuItem}>
        <button className={styles.MenuButton} type="button">
          <Review className={styles.MenuIcon} />내 리뷰 관리
        </button>
      </li>
    </ul>
    <ul className={styles.MenuList}>
      <li className={styles.MenuItem}>
        <button className={styles.MenuButton} type="button">
          <Download className={styles.MenuIcon} />
          구매 목록 엑셀 다운로드
        </button>
      </li>
    </ul>
    <div className={styles.MenuItem}>
      <button className={styles.MenuButton} type="button">
        <Logout className={styles.MenuIcon} />
        로그아웃
      </button>
    </div>
  </section>
);

export default MyMenuModal;

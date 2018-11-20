import React from 'react';
import { Icon } from '@ridi/rsg';
import * as styles from './styles';
import { hidden } from '../../../styles';

const MyMenuModal = ({ userId }) => (
  <section className={styles.MyMenuModal}>
    <h2 className={hidden}>마이메뉴</h2>
    <div className={styles.MenuItem}>
      <p className={styles.UserId}>
        <strong>{userId}</strong> 님
      </p>
    </div>
    <ul className={styles.MenuList}>
      <li className={styles.MenuItem}>
        <button className={styles.MenuButton} type="button">
          <Icon className={styles.MenuIcon} name="document" />
          숨김 도서 목록
        </button>
      </li>
      <li className={styles.MenuItem}>
        <button className={styles.MenuButton} type="button">
          <Icon className={styles.MenuIcon} name="document" />
          구매 목록 엑셀 다운로드
        </button>
      </li>
    </ul>
    <div className={styles.MenuItem}>
      <button className={styles.MenuButton} type="button">
        <Icon className={styles.MenuIcon} name="document" />
        로그아웃
      </button>
    </div>
  </section>
);

export default MyMenuModal;

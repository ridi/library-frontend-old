import React from 'react';
import * as styles from './styles';

const LNBTitleBar = ({ title, onBackPressed, a11y = '뒤로가기' }) => (
  <nav className={styles.LNBTitleBar}>
    <button className={styles.LNBTitleBarBackButton} onClick={onBackPressed} type="button">
      {title}
      <span className="a11y">{a11y}</span>
    </button>
  </nav>
);

export default LNBTitleBar;

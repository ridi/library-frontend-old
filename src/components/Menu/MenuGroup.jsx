import React from 'react';
import * as styles from './styles';

const MenuGroup = ({ title, children }) => (
  <div className={styles.MenuGroup}>
    <div className={styles.MenuGroupTitle}>{title}</div>
    <ul className={styles.MenuGroupList}>{children}</ul>
  </div>
);
export default MenuGroup;

import React from 'react';
import { Icon } from '@ridi/rsg';
import * as styles from './styles';

const MenuItem = ({ title, showIcon, icon, onClick }) => (
  <li className={styles.MenuGroupItemWrapper}>
    <button type="button" className={styles.MenuGroupItem} onClick={onClick}>
      {showIcon ? <Icon name={icon} className={styles.MenuGroupItemIcon} /> : null}
      <span className={styles.MenuGroupItemTitle}>{title}</span>
    </button>
  </li>
);

export default MenuItem;

import React from 'react';
import { Icon } from '@ridi/rsg';
import * as styles from './styles';

const MenuItem = ({ title, showIcon, iconName, onClick }) => (
  <li className={styles.MenuGroupItemWrapper}>
    <button type="button" className={styles.MenuGroupItem} onClick={onClick}>
      {showIcon ? (
        <div className={styles.MenuGroupItemIconWrapper}>
          <Icon name={iconName} className={styles.MenuGroupItemIcon} />
        </div>
      ) : null}
      <div className={styles.MenuGroupItemTitle}>{title}</div>
    </button>
  </li>
);

export default MenuItem;

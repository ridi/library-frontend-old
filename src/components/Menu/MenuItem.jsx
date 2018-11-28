import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import * as styles from './styles';

export const MenuItem = ({ title, showIcon, icon, onClick }) => (
  <li className={styles.MenuGroupItemWrapper}>
    <button type="button" className={styles.MenuGroupItem} onClick={onClick}>
      {showIcon ? <Icon name={icon} className={styles.MenuGroupItemIcon} /> : null}
      <span className={styles.MenuGroupItemTitle}>{title}</span>
    </button>
  </li>
);

export const MenuLinkItem = ({ title, showIcon, icon, href, as }) => (
  <li className={styles.MenuGroupItemWrapper}>
    <Link className={styles.MenuGroupItem} href={href} as={as}>
      <a className={styles.MenuGroupItem}>
        {showIcon ? <Icon name={icon} className={styles.MenuGroupItemIcon} /> : null}
        <span className={styles.MenuGroupItemTitle}>{title}</span>
      </a>
    </Link>
  </li>
);

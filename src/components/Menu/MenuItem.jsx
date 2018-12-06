/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import * as styles from './styles';

import { snakelize } from '../../utils/snakelize';

export const MenuItem = ({ title, showIcon, icon, onClick }) => (
  <li css={styles.MenuGroupItemWrapper}>
    <button type="button" css={styles.MenuGroupItem} onClick={onClick}>
      {showIcon ? <Icon name={icon} css={styles.MenuGroupItemIcon} /> : null}
      <span css={styles.MenuGroupItemTitle}>{title}</span>
    </button>
  </li>
);

export const MenuLinkItem = ({ title, showIcon, icon, href, as, query = {} }) => (
  <li css={styles.MenuGroupItemWrapper}>
    <Link href={{ pathname: href, query: snakelize(query) }} as={{ pathname: as, query: snakelize(query) }}>
      <a css={styles.MenuGroupItem}>
        {showIcon ? <Icon name={icon} css={styles.MenuGroupItemIcon} /> : null}
        <span css={styles.MenuGroupItemTitle}>{title}</span>
      </a>
    </Link>
  </li>
);

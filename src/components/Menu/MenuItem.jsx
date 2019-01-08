/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { makeLinkProps } from '../../utils/uri';
import * as styles from './styles';

export const MenuItem = ({ title, showIcon, icon, onClick }) => (
  <li css={styles.menuGroupItemWrapper}>
    <button type="button" css={styles.menuGroupItem} onClick={onClick}>
      {showIcon ? <Icon name={icon} css={styles.menuGroupItemIcon} /> : null}
      <span css={styles.menuGroupItemTitle}>{title}</span>
    </button>
  </li>
);

export const MenuLinkItem = ({ title, showIcon, icon, href, as, query = {} }) => (
  <li css={styles.menuGroupItemWrapper}>
    <Link {...makeLinkProps(href, as, query)}>
      <a css={styles.menuGroupItem}>
        {showIcon ? <Icon name={icon} css={styles.menuGroupItemIcon} /> : null}
        <span css={styles.menuGroupItemTitle}>{title}</span>
      </a>
    </Link>
  </li>
);

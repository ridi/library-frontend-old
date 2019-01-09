/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Link from 'next/link';
import { makeLinkProps } from '../../utils/uri';

const styles = {
  tabItem: css({
    float: 'left',
    height: '100%',

    marginLeft: 8,
    '&:first-of-type': {
      marginLeft: 0,
    },
  }),
  tabButton: css({
    padding: 8,
    height: '100%',
    boxSizing: 'border-box',
    border: 0,

    color: '#808991',
    fontSize: 16,
    letterSpacing: -0.3,
    textAlign: 'center',
  }),

  tabButtonActive: css({
    color: '#40474d',
    fontWeight: 'bolder',
    borderBottom: '3px solid #9ea7ad',
  }),
};

export const TabItem = ({ name, onClick, isActive }) => (
  <li css={styles.tabItem}>
    <button type="button" onClick={onClick} css={[styles.tabButton, isActive && styles.tabButtonActive]}>
      {name}
    </button>
  </li>
);

export const TabLinkItem = ({ name, href, as, query, isActive }) => (
  <li css={styles.tabItem}>
    <Link {...makeLinkProps(href, as, query)}>
      <a>
        <div css={[styles.tabButton, isActive && styles.tabButtonActive]}>{name}</div>
      </a>
    </Link>
  </li>
);

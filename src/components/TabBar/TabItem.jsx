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
    '& button': {
      color: '#808991',
      fontSize: 16,
      letterSpacing: -0.3,
      textAlign: 'center',
    },
  }),
  tabItemActive: css({
    '& button': {
      color: '#40474d',
      fontWeight: 'bolder',
      borderBottom: '3px solid #9ea7ad',
    },
  }),
  tabButton: css({
    padding: 8,
    height: '100%',
    boxSizing: 'border-box',
    border: 0,
  }),
};

export const TabItem = ({ name, onClick, isActive }) => (
  <li css={[styles.tabItem, isActive && styles.tabItemActive]}>
    <button type="button" onClick={onClick} css={styles.tabButton}>
      {name}
    </button>
  </li>
);

export const TabLinkItem = ({ name, href, as, query, isActive }) => (
  <li css={[styles.tabItem, isActive && styles.tabItemActive]}>
    <Link {...makeLinkProps(href, as, query)}>
      <a>
        <div css={styles.tabButton}>{name}</div>
      </a>
    </Link>
  </li>
);

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from 'react-router-dom';
import { makeLinkProps } from '../../utils/uri';
import * as styles from './styles';

export const TabItem = ({ name, onClick, isActive }) => (
  <li css={styles.tabItem}>
    <button type="button" onClick={onClick} css={[styles.tabButton, styles.tabButtonToggle(isActive)]}>
      {name}
      <span css={[styles.activeBar, styles.activeBarToggle(isActive)]} />
    </button>
  </li>
);

export const TabLinkItem = ({ name, as, query, isActive, icon }) => (
  <li css={styles.tabItem}>
    <Link {...makeLinkProps({}, as, query)} css={[styles.tabButton, styles.tabButtonToggle(isActive)]}>
      {name}
      {icon && icon(isActive)}
      <span css={[styles.activeBar, styles.activeBarToggle(isActive)]} />
    </Link>
  </li>
);

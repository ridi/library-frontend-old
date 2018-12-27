/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const TabItem = ({ name, onClick, isActive }) => (
  <li css={styles.tabItem}>
    <button type="button" onClick={onClick} css={[styles.tabButton, styles.tabButtonToggle(isActive)]}>
      {name}
    </button>
    <div css={[styles.activeBar, styles.activeBarToggle(isActive)]} />
  </li>
);

export default TabItem;

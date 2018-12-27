/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const TabItem = ({ name, onClick, isActive }) => (
  <li className={isActive && 'active'} css={styles.tabItem}>
    <button type="button" onClick={onClick} css={styles.tabButton}>
      {name}
    </button>
    <div css={styles.activeBar} />
  </li>
);

export default TabItem;

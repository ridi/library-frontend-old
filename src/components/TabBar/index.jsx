/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const TabBar = ({ children }) => (
  <nav css={styles.tabBar}>
    <ul>{children}</ul>
  </nav>
);
export default TabBar;
export { TabItem, TabLinkItem } from './TabItem';

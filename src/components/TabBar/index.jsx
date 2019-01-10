/** @jsx jsx */
import { jsx } from '@emotion/core';

const styles = {
  tabBar: {
    width: '100%',
  },
};

const TabBar = ({ children }) => (
  <nav css={styles.tabBar}>
    <ul>{children}</ul>
  </nav>
);
export default TabBar;
export { TabItem, TabLinkItem } from './TabItem';

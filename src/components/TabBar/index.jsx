/** @jsx jsx */
import { jsx } from '@emotion/core';

const styles = {
  tabBar: {
    width: '100%',
  },
};

const TabBar = ({ children }) => <ul css={styles.tabBar}>{children}</ul>;
export default TabBar;

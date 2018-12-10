/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const styles = {
  tabBar: css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
    height: 40,
  }),
};

const TabBar = ({ children }) => <ul css={styles.tabBar}>{children}</ul>;
export default TabBar;

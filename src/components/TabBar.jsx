/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const styles = {
  TabBar: css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
    height: 40,
  }),
};

const TabBar = ({ children }) => <ul css={styles.TabBar}>{children}</ul>;
export default TabBar;

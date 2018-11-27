import React from 'react';
import { css } from 'emotion';

const styles = {
  TabBar: css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
    height: 40,
  }),
};

const TabBar = ({ children }) => <ul className={styles.TabBar}>{children}</ul>;
export default TabBar;

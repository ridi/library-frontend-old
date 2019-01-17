/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

export const TabBar = ({ children }) => (
  <nav css={styles.tabBar}>
    <ul>{children}</ul>
  </nav>
);

export * from './TabItem';

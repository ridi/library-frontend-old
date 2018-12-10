/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const MenuGroup = ({ title, children }) => (
  <div css={styles.menuGroup}>
    <div css={styles.menuGroupTitle}>{title}</div>
    <ul css={styles.menuGroupList}>{children}</ul>
  </div>
);
export default MenuGroup;

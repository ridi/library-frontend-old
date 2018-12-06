/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const MenuGroup = ({ title, children }) => (
  <div css={styles.MenuGroup}>
    <div css={styles.MenuGroupTitle}>{title}</div>
    <ul css={styles.MenuGroupList}>{children}</ul>
  </div>
);
export default MenuGroup;

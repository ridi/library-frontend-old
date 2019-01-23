/** @jsx jsx */
import { jsx } from '@emotion/core';
import Responsive from '../../pages/base/Responsive';
import * as styles from './styles';

export const ActionBar = ({ children }) => (
  <div css={styles.actionBarFixedWrapper}>
    <Responsive>
      <div css={styles.actionBar}>{children}</div>
    </Responsive>
  </div>
);

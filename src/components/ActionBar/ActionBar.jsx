import React from 'react';
import Responsive from '../../pages/base/Responsive';
import * as styles from './styles';

export const ActionBar = ({ children }) => (
  <>
    <div css={styles.actionBarPadding} />
    <div css={styles.actionBarFixedWrapper}>
      <Responsive>
        <div css={styles.actionBar}>{children}</div>
      </Responsive>
    </div>
  </>
);

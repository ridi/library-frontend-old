import React from 'react';

import FlexBar from '../FlexBar';
import { Editing } from '../Tool';
import * as styles from './styles';

const SerialPreferenceToolBar = props => {
  const { toggleEditingMode, totalCount, isFetchingBooks } = props;

  return (
    <FlexBar
      css={styles.toolBar}
      flexLeft={<span css={styles.totalCount}>{!isFetchingBooks ? `총 ${totalCount}작품` : ''}</span>}
      flexRight={<Editing toggleEditingMode={toggleEditingMode} />}
    />
  );
};

export default SerialPreferenceToolBar;

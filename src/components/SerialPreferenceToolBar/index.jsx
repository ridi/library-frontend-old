import React from 'react';

import FlexBar from 'components/FlexBar';
import { Editing } from 'components/Tool';
import TotalCount from 'components/Tool/TotalCount';

import * as styles from './styles';

const SerialPreferenceToolBar = props => {
  const { toggleEditingMode, totalCount, isFetchingBooks } = props;

  return (
    <FlexBar
      css={styles.toolBar}
      flexLeft={!isFetchingBooks ? <TotalCount count={totalCount} unit="작품" /> : <div />}
      flexRight={<Editing toggleEditingMode={toggleEditingMode} />}
    />
  );
};

export default SerialPreferenceToolBar;

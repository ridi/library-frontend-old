import React from 'react';
import { Editing } from '../Tool';
import FlexBar from '../FlexBar';
import * as styles from './styles';

class SerialPreferenceToolBar extends React.Component {
  render() {
    const { toggleEditingMode, totalCount, isFetchingBooks } = this.props;

    return (
      <FlexBar
        css={styles.toolBar}
        flexLeft={<span css={styles.totalCount}>{!isFetchingBooks ? `총 ${totalCount}작품` : ''}</span>}
        flexRight={<Editing toggleEditingMode={toggleEditingMode} />}
      />
    );
  }
}

export default SerialPreferenceToolBar;

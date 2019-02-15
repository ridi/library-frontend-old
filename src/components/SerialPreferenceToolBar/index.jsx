/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Editing } from '../Tool';
import FlexBar from '../FlexBar';
import * as styles from './styles';

class SerialPreferenceToolBar extends React.Component {
  render() {
    const { toggleEditingMode, totalCount } = this.props;

    return (
      <FlexBar
        css={styles.toolBar}
        renderFlexLeft={() => <span css={styles.totalCount}>총 {totalCount}작품</span>}
        renderFlexRight={() => <Editing toggleEditingMode={toggleEditingMode} />}
      />
    );
  }
}

export default SerialPreferenceToolBar;

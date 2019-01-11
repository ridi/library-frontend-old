import React from 'react';
import classnames from 'classnames';
import { css } from '@emotion/core';

import { SkeletonUnitBook, SkeletonTextRow, SkeletonThinTextRow, SkeletonBoldTextRow } from './components';
import { Responsive } from '../../styles/responsive';

const styles = {
  flexWrapper: css({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  }),

  info: css({
    ...Responsive.W1280({
      justifyContent: 'left',
    }),
  }),
};

const SkeletonUnitSection = () => (
  <section>
    <div css={classnames([styles.flexWrapper])}>
      <SkeletonUnitBook />
      <SkeletonThinTextRow />
    </div>
    <div css={classnames([styles.flexWrapper, styles.info])}>
      <SkeletonBoldTextRow />
      <SkeletonTextRow />
      <SkeletonTextRow />
    </div>
  </section>
);

export default SkeletonUnitSection;

/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { SkeletonUnitBook, SkeletonTextRow, SkeletonThinTextRow, SkeletonBoldTextRow } from './components';
import { Responsive } from '../../styles/responsive';

const styles = {
  section: css({
    display: 'flex',
    flexDirection: 'column',

    marginTop: 28,

    ...Responsive.W834({
      marginTop: 50,
    }),

    ...Responsive.W1280({
      marginTop: 50,
      flexDirection: 'row',
    }),
  }),

  flexWrapper: css({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  info: css({
    marginTop: 24,

    ...Responsive.Pc({
      marginTop: 47,
    }),

    ...Responsive.W1280({
      marginLeft: 40,
      alignItems: 'start',
      justifyContent: 'left',
    }),
  }),

  margin16: css({
    marginTop: 16,
  }),

  margin24: css({
    marginTop: 16,
  }),
};

const SkeletonUnitDetailView = () => (
  <section css={styles.section}>
    <div css={[styles.flexWrapper, styles.book]}>
      <SkeletonUnitBook />
      <SkeletonThinTextRow style={styles.margin16} />
    </div>
    <div css={[styles.flexWrapper, styles.info]}>
      <SkeletonBoldTextRow />
      <SkeletonTextRow style={styles.margin16} />
      <SkeletonTextRow style={styles.margin24} />
    </div>
  </section>
);

export default SkeletonUnitDetailView;

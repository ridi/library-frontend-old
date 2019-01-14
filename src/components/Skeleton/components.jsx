/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Responsive } from '../../styles/responsive';

const styles = {
  skeleton: css({
    backgroundImage: 'linear-gradient(147deg, #f8f9fb, #f1f1f3 55%, #f8f9fb)',
  }),

  book: css({
    width: 110,
    height: 168,

    ...Responsive.W360({
      width: 98,
      height: 151,
    }),

    ...Responsive.W1280({
      width: 180,
      height: 260,
    }),
  }),

  unitBook: css({
    width: 130,
    height: 191,

    ...Responsive.W834({
      width: 180,
      height: 265,
    }),

    ...Responsive.W1280({
      width: 180,
      height: 265,
    }),
  }),

  thinTextRow: css({
    width: 130,
    height: 20,
  }),

  textRow: css({
    height: 20,
    width: 320,

    ...Responsive.W834({
      width: 400,
    }),

    ...Responsive.W1280({
      width: 400,
    }),
  }),

  boldTextRow: css({
    width: 300,
    height: 24,

    ...Responsive.W834({
      height: 28,
    }),

    ...Responsive.W1280({
      height: 28,
    }),
  }),
};

export const SkeletonBook = () => <div css={[styles.skeleton, styles.book]} />;

export const SkeletonUnitBook = () => <div css={[styles.skeleton, styles.unitBook]} />;

export const SkeletonThinTextRow = ({ style }) => <div css={[styles.skeleton, styles.thinTextRow, style]} />;
export const SkeletonTextRow = ({ style }) => <div css={[styles.skeleton, styles.textRow, style]} />;
export const SkeletonBoldTextRow = ({ style }) => <div css={[styles.skeleton, styles.boldTextRow, style]} />;

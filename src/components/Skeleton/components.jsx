/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classname from 'classnames';
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

    ...Responsive.W834({
      width: 400,
    }),

    ...Responsive.W1280({
      width: 400,
    }),
  }),

  boldTextRow: css({
    width: 320,
    height: 24,

    ...Responsive.W834({
      height: 28,
    }),

    ...Responsive.W1280({
      height: 28,
    }),
  }),
};

export const SkeletonBook = () => <div css={classname([styles.skeleton, styles.book])} />;

export const SkeletonUnitBook = () => <div css={classname([styles.skeleton, styles.unitBook])} />;

export const SkeletonThinTextRow = () => <div css={classname([styles.skeleton, styles.thinTextRow])} />;
export const SkeletonTextRow = () => <div css={classname([styles.skeleton, styles.textRow])} />;
export const SkeletonBoldTextRow = () => <div css={classname([styles.skeleton, styles.boldTextRow])} />;

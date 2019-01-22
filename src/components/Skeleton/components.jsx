/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Responsive } from '../../styles/responsive';

const styles = {
  skeleton: css({
    backgroundImage: 'linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb)',
  }),

  book: css({
    width: 110,
    height: 168,

    ...Responsive.W360({
      width: 98,
      height: 151,
    }),
  }),
};

export const SkeletonBook = () => <div css={[styles.skeleton, styles.book]} />;

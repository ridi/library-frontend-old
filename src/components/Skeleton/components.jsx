/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Responsive } from '../../styles/responsive';

const styles = {
  skeleton: css({
    backgroundImage: 'linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb)',
  }),

  portraitBook: css({
    width: 110,
    height: 168,

    ...Responsive.W360({
      width: 98,
      height: 151,
    }),
  }),

  landscapeBookWrapper: css({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'left',

    marginTop: 30,
  }),

  landscapeBook: css({
    width: 66,
    height: 88,
  }),

  landscapeMetaWrapper: css({
    marginTop: 8,
    marginLeft: 16,
  }),
  landscapeBookTitle: css({
    width: 200,
    height: 20,
  }),
  landscapeBookAuthor: css({
    width: 200,
    height: 20,

    marginTop: 4,
  }),
};

export const SkeletonPortraitBook = () => <div css={[styles.skeleton, styles.portraitBook]} />;

export const SkeletonLandscapeBook = () => (
  <div css={styles.landscapeBookWrapper}>
    <div css={[styles.skeleton, styles.landscapeBook]} />
    <div css={styles.landscapeMetaWrapper}>
      <div css={[styles.skeleton, styles.landscapeBookTitle]} />
      <div css={[styles.skeleton, styles.landscapeBookAuthor]} />
    </div>
  </div>
);

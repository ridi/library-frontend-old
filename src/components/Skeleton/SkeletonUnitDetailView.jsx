/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Responsive } from '../../styles/responsive';

const styles = {
  skeleton: css({
    backgroundImage: 'linear-gradient(147deg, #f8f9fb, #f1f1f3 55%, #f8f9fb)',
  }),

  detailView: css({
    display: 'flex',
    flexDirection: 'column',

    marginTop: 28,

    ...Responsive.Pc({
      marginTop: 50,
      flexDirection: 'row',
    }),

    ...Responsive.W1280({
      marginLeft: 100,
    }),
  }),

  wrapper: css({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  thumbnailWrapper: css({}),
  thumbnail: css({
    width: 130,
    height: 191,

    ...Responsive.Pc({
      width: 180,
      height: 265,
    }),
  }),
  ridibooksLink: css({
    marginTop: 16,
    width: 130,
    height: 20,
  }),

  infoWrapper: css({
    marginTop: 24,

    alignItems: 'start',
    justifyContent: 'left',

    ...Responsive.Pc({
      marginTop: 48,
      marginLeft: 40,
    }),
  }),
  unitTitle: css({
    width: 328,
    height: 24,

    ...Responsive.Pc({
      width: 334,
      height: 28,
    }),
  }),
  authorList: css({
    width: 277,
    height: 20,

    ...Responsive.Pc({
      marginTop: 16,
      width: 400,
      height: 20,
    }),
  }),
};

const SkeletonUnitDetailView = () => (
  <section css={styles.detailView}>
    <div css={[styles.wrapper, styles.thumbnailWrapper]}>
      <div css={[styles.skeleton, styles.thumbnail]} />
      <div css={[styles.skeleton, styles.ridibooksLink]} />
    </div>
    <div css={[styles.wrapper, styles.infoWrapper]}>
      <div css={[styles.skeleton, styles.unitTitle]} />
      <div css={[styles.skeleton, styles.authorList]} />
    </div>
  </section>
);

export default SkeletonUnitDetailView;

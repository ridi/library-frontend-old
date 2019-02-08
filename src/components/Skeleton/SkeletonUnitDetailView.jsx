/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './unitDetailViewStyles';

const SkeletonUnitDetailView = () => (
  <section css={styles.detailView}>
    <div css={styles.thumbnailWrapper}>
      <div css={styles.thumbnail} />
      <div css={styles.ridibooksLink} />
    </div>
    <div css={styles.infoWrapper}>
      <div css={styles.unitTitle} />
      <div css={styles.authorList} />
    </div>
  </section>
);

export default SkeletonUnitDetailView;

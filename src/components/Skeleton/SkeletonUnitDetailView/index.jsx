import * as styles from './styles';

const SkeletonUnitDetailView = () => (
  <section css={styles.header}>
    <div css={styles.thumbnailWrapper}>
      <div css={styles.thumbnail} />
      <div css={styles.outerTextLink} />
    </div>
    <div css={styles.infoWrapper}>
      <div css={styles.title} />
      <div css={styles.authorList} />
      <div css={styles.fileInfo} />
    </div>
  </section>
);

export default SkeletonUnitDetailView;

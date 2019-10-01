import * as styles from './landscapeBookStyles';

const LandscapeBook = () => (
  <div css={styles.landscapeBook}>
    <div css={styles.thumbnailWrapper}>
      <div css={styles.thumbnail} />
    </div>
    <div css={styles.metadataWrapper}>
      <div css={styles.title} />
      <div css={styles.author} />
    </div>
  </div>
);
export default LandscapeBook;

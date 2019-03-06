/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from '../../styles/books';

const EmptyLandscapeBook = () => (
  <div className="EmptyLandscapeBook" css={styles.landscape}>
    <div className="LandscapeBook" />
  </div>
);

export default EmptyLandscapeBook;

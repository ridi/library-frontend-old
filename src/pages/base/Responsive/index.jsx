/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const Responsive = ({ className, children, hasPadding = true }) => (
  <div className={className}>
    <div css={styles.responsive(hasPadding)}>{children}</div>
  </div>
);
export default Responsive;

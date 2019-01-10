/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const Responsive = ({ className, children }) => (
  <div className={className}>
    <div css={styles.responsive}>{children}</div>
  </div>
);
export default Responsive;

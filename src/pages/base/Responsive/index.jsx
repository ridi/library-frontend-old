/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

const Responsive = ({ className, children }) => (
  <div css={styles.Responsive} className={className}>
    {children}
  </div>
);
export default Responsive;

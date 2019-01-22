/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Responsive from '../../pages/base/Responsive';

const styles = {
  bottomActionBar: css({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#f7f9fa',
    boxShadow: '0 -2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderTop: '1px solid #d1d5d9',
    zIndex: 999,
  }),
};

const BottomActionBar = ({ children }) => (
  <div css={styles.bottomActionBar}>
    <Responsive>{children}</Responsive>
  </div>
);

export default BottomActionBar;

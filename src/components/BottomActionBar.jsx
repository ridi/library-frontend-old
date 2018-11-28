import React from 'react';
import { css } from 'emotion';
import Responsive from '../pages/base/Responsive';

const styles = {
  BottomActionBar: css({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#f7f9fa',
    boxShadow: '0 -2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #d1d5d9',
  }),
};

const BottomActionBar = ({ children }) => (
  <div className={styles.BottomActionBar}>
    <Responsive>{children}</Responsive>
  </div>
);

export default BottomActionBar;

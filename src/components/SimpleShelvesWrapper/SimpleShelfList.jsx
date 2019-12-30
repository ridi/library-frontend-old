import React from 'react';

import * as styles from './styles';

const SimpleShelfList = ({ key, children }) => (
  <li key={key} css={styles.simpleShelvesItem}>
    {children}
  </li>
);

export default SimpleShelfList;

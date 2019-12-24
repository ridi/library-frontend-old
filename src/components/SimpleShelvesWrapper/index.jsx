import React from 'react';

import * as styles from './styles';

const SimpleShelvesWrapper = ({ renderList }) => {
  const renderItem = ({ key, item }) => (
    <li key={key} css={styles.simpleShelvesItem}>
      {item}
    </li>
  );
  return <ul css={styles.simpleShelves}>{renderList(renderItem)}</ul>;
};

export default SimpleShelvesWrapper;

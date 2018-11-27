import React from 'react';
import classNames from 'classnames';
import * as styles from './styles';

const TabItem = ({ name, onClick, isActive }) => (
  <li className={classNames(styles.TabItem, { [styles.TabItemActive]: isActive })}>
    <button type="button" onClick={onClick} className={styles.TabButton}>
      {name}
    </button>
  </li>
);

export default TabItem;

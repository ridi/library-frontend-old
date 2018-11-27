import React from 'react';
import { css } from 'emotion';
import classNames from 'classnames';

const styles = {
  TabItem: css({
    float: 'left',
    height: '100%',

    marginLeft: 8,
    '&:first-of-type': {
      marginLeft: 0,
    },
    '& button': {
      color: '#808991',
      fontSize: 16,
      letterSpacing: -0.3,
      textAlign: 'center',
    },
  }),
  TabItemActive: css({
    '& button': {
      color: '#40474d',
      fontWeight: 'bolder',
      borderBottom: '3px solid #9ea7ad',
    },
  }),
  TabButton: css({
    padding: 8,
    height: '100%',
    boxSizing: 'border-box',
    border: 0,
  }),
};

const TabItem = ({ name, onClick, isActive }) => (
  <li className={classNames(styles.TabItem, { [styles.TabItemActive]: isActive })}>
    <button type="button" onClick={onClick} className={styles.TabButton}>
      {name}
    </button>
  </li>
);

export default TabItem;

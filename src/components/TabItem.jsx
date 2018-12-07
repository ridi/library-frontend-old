/** @jsx jsx */
import { jsx, css } from '@emotion/core';

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
  <li css={[styles.TabItem, isActive && styles.TabItemActive]}>
    <button type="button" onClick={onClick} css={styles.TabButton}>
      {name}
    </button>
  </li>
);

export default TabItem;

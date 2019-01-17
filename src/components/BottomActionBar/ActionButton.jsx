/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';

export const ActionButton = ({ name, onClick, disable, className = '' }) => (
  <button type="button" css={styles.actionButton(disable)} className={className} onClick={onClick} disabled={disable}>
    {name}
  </button>
);

import React from 'react';
import { useSelector } from 'react-redux';

import { ITEMS_LIMIT_PER_SHELF } from 'constants/shelves';
import * as shelfSelectors from 'services/shelf/selectors';
import CheckCircle from 'svgs/CheckCircle.svg';

import * as styles from './sytles';

const SimpleShelf = ({ shelfId, isSelect, handleShelfSelectChange }) => {
  const shelfKey = `SimpleShelf-${shelfId}`;
  const shelfName = useSelector(state => shelfSelectors.getShelfName(state, shelfId));
  const shelfBookCount = useSelector(state => shelfSelectors.getShelfBookCount(state, shelfId));
  const disabled = shelfBookCount >= ITEMS_LIMIT_PER_SHELF;

  return (
    <li css={styles.simpleShelf} className={disabled ? 'disabled' : ''}>
      <label htmlFor={shelfKey} css={styles.checkButton} className={isSelect ? `active` : ``}>
        <span css={styles.checkIconBorder} />
        <CheckCircle css={styles.checkIcon} />
        <input
          id={shelfKey}
          type="radio"
          name="simpleShelves"
          onChange={() => {
            handleShelfSelectChange(shelfId);
          }}
          disabled={disabled}
        />
      </label>
      <p css={styles.shelfName}>{shelfName}</p>
      <p css={styles.shelfBookCount}>{shelfBookCount > 0 ? shelfBookCount : ''}</p>
    </li>
  );
};

export default SimpleShelf;

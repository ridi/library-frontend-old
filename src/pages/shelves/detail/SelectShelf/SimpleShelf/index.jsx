import React from 'react';
import { useSelector } from 'react-redux';

import * as shelfSelectors from 'services/shelf/selectors';
import CheckCircle from 'svgs/CheckCircle.svg';

import * as styles from './sytles';

const SimpleShelf = ({ shelfId, isSelect, handleShelfSelectChange }) => {
  const shelfKey = `SimpleShelf-${shelfId}`;
  const shelfName = useSelector(state => shelfSelectors.getShelfName(state, shelfId));
  const shelfBookCount = useSelector(state => shelfSelectors.getShelfBookCount(state, shelfId));

  return (
    <li css={styles.simpleShelf}>
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
        />
      </label>
      <p css={styles.shelfName}>{shelfName}</p>
      <p css={styles.shelfBookCount}>{shelfBookCount > 0 ? shelfBookCount : ''}</p>
    </li>
  );
};

export default SimpleShelf;

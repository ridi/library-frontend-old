import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectionActions } from 'services/selection/reducers';
import { getSelectedShelfIds } from 'services/selection/selectors';

import SimpleShelf from './SimpleShelf';
import * as styles from './sytles';

const SimpleShelves = ({ shelfIds }) => {
  const dispatch = useDispatch();
  const selectedShelfIds = useSelector(getSelectedShelfIds);
  const handleShelfSelectChange = shelfId => {
    dispatch(selectionActions.clearSelectedShelves());
    dispatch(selectionActions.selectShelves([shelfId]));
  };
  return (
    <ul css={styles.simpleShelves}>
      {shelfIds.map(shelfId => (
        <li key={shelfId} css={styles.simpleShelvesItem}>
          <SimpleShelf shelfId={shelfId} isSelect={selectedShelfIds.includes(shelfId)} handleShelfSelectChange={handleShelfSelectChange} />
        </li>
      ))}
    </ul>
  );
};

export default SimpleShelves;

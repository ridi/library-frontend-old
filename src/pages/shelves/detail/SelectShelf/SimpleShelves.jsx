import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectionActions } from 'services/selection/reducers';
import { getSelectedShelfIds } from 'services/selection/selectors';

import SimpleShelf from './SimpleShelf';

const SimpleShelves = ({ shelfIds }) => {
  const dispatch = useDispatch();
  const selectedShelfIds = useSelector(getSelectedShelfIds);
  const handleShelfSelectChange = shelfId => {
    dispatch(selectionActions.clearSelectedShelves());
    dispatch(selectionActions.selectShelves([shelfId]));
  };
  return (
    <ul>
      {shelfIds.map(shelfId => (
        <SimpleShelf
          key={shelfId}
          shelfId={shelfId}
          isSelect={selectedShelfIds.includes(shelfId)}
          handleShelfSelectChange={handleShelfSelectChange}
        />
      ))}
    </ul>
  );
};

export default SimpleShelves;

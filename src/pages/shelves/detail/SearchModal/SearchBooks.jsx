import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { Books } from 'components/Books';
import ViewType from 'constants/viewType';
import * as bookActions from 'services/book/actions';
import * as bookSelectors from 'services/book/selectors';

function emptyLinkBuilder() {
  return null;
}

const selectBookIds = createSelector(
  items => items,
  items => (items ? items.map(item => item.b_id) : null),
);

const SearchBooks = ({ items, inactiveBookIds }) => {
  const bookIds = selectBookIds(items);
  const dispatch = useDispatch();
  const platformBooks = useSelector(state => bookSelectors.getBooks(state, bookIds));

  React.useEffect(() => {
    dispatch(bookActions.loadBookData(items.map(item => item.b_id)));
    dispatch(bookActions.loadUnitData(items.map(item => item.unit_id)));
  }, [items]);

  return (
    <Books
      libraryBookDTO={items}
      platformBookDTO={platformBooks}
      isSelectMode
      viewType={ViewType.LANDSCAPE}
      linkBuilder={emptyLinkBuilder}
      inactiveBookIds={inactiveBookIds}
    />
  );
};

export default SearchBooks;

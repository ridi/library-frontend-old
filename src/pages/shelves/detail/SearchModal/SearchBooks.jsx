import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { Books } from 'components/Books';
import { ITEMS_LIMIT_PER_SHELF } from 'constants/shelves';
import ViewType from 'constants/viewType';
import * as bookActions from 'services/book/actions';
import * as bookSelectors from 'services/book/selectors';
import { toggleItem } from 'services/selection/actions';
import { showToast } from 'services/toast/actions';
import { ToastStyle } from 'services/toast/constants';

function emptyLinkBuilder() {
  return null;
}

const selectBookIds = createSelector(
  items => items,
  items => (items ? items.map(item => item.b_id) : null),
);

const SearchBooks = ({ items, shelfAllBookUnitIds, totalSelectedCount }) => {
  const bookIds = selectBookIds(items);
  const dispatch = useDispatch();
  const platformBooks = useSelector(state => bookSelectors.getBooks(state, bookIds));

  React.useEffect(() => {
    dispatch(bookActions.loadBookData(items.map(item => item.b_id)));
    dispatch(bookActions.loadUnitData(items.map(item => item.unit_id)));
  }, [items]);

  const handleSelectedChange = React.useCallback(
    bookId => {
      const shelfAllBookCount = shelfAllBookUnitIds.length;
      if (shelfAllBookCount + totalSelectedCount > ITEMS_LIMIT_PER_SHELF) {
        dispatch(
          showToast({
            message: `최대 ${ITEMS_LIMIT_PER_SHELF}권까지 추가할 수 있습니다.`,
            toastStyle: ToastStyle.BLUE,
            withBottomFixedButton: true,
          }),
        );
      } else {
        dispatch(toggleItem(bookId));
      }
    },
    [shelfAllBookUnitIds, totalSelectedCount],
  );

  return (
    <Books
      libraryBookDTO={items}
      platformBookDTO={platformBooks}
      isSelectMode
      viewType={ViewType.LANDSCAPE}
      linkBuilder={emptyLinkBuilder}
      inactiveBookUnitIds={shelfAllBookUnitIds}
      onSelectedChange={handleSelectedChange}
    />
  );
};

export default SearchBooks;

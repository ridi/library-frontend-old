import { Book } from '@ridi/web-ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { observer } from 'mobx-react';

import * as styles from 'commonStyles/books';
import ViewType from 'constants/viewType';
import { getAdultVerification } from 'services/account/selectors';
import { toggleItem } from 'services/selection/actions';
import * as selectionSelectors from 'services/selection/selectors';

import { Disabled } from './Disabled';
import FullButton from './FullButton';
import refineBookData from './mobxRefineBookData';

const MobxBookItem = props => {
  const { book, className, isSelectMode, isSeriesView, linkBuilder, thumbnailWidth, viewType, inactive, onSelectedChange } = props;
  const bookId = book.book.id;
  const dispatch = useDispatch();
  const isSelected = useSelector(state => selectionSelectors.getIsItemSelected(state, bookId));
  const isVerifiedAdult = useSelector(getAdultVerification);
  const showUpdateBadge = isSeriesView ? book.book.isRecentlyUpdated : Boolean(book.book.lastOpenVolume?.isRecentlyUpdated);

  const handleSelectedChange = React.useCallback(() => (onSelectedChange ? onSelectedChange(bookId) : dispatch(toggleItem(bookId))), [
    onSelectedChange,
    bookId,
  ]);

  const { libraryBookProps, thumbnailLink } = refineBookData({
    item: book,
    isSelectMode,
    isSelected,
    onSelectedChange: handleSelectedChange,
    viewType,
    linkBuilder,
    showUpdateBadge,
    thumbnailWidth,
    isVerifiedAdult,
    inactive,
  });

  return viewType === ViewType.PORTRAIT ? (
    <div className={className} css={styles.portrait}>
      <Book.PortraitBook {...libraryBookProps} />
    </div>
  ) : (
    <div className={className} css={styles.landscape}>
      <Book.LandscapeBook {...libraryBookProps} />
      {isSelectMode && inactive && <Disabled />}
      {!isSelectMode && thumbnailLink && <FullButton>{thumbnailLink}</FullButton>}
    </div>
  );
};

export default observer(MobxBookItem);

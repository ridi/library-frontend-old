import { Book } from '@ridi/web-ui';
import React from 'react';
import isAfter from 'date-fns/is_after';
import subDays from 'date-fns/sub_days';
import { useDispatch, useSelector } from 'react-redux';

import * as styles from 'commonStyles/books';
import LandscapeBook from 'components/Skeleton/SkeletonBooks/LandscapeBook';
import PortraitBook from 'components/Skeleton/SkeletonBooks/PortraitBook';
import ViewType from 'constants/viewType';
import { getAdultVerification } from 'services/account/selectors';
import * as bookSelectors from 'services/book/selectors';
import { getIsRecentlyUpdated } from 'services/purchased/common/selectors';
import { toggleItem } from 'services/selection/actions';
import * as selectionSelectors from 'services/selection/selectors';

import { Disabled } from './Disabled';
import FullButton from './FullButton';
import refineBookData from './refineBookData';

const BookItem = props => {
  const { bookId, className, isSelectMode, isSeriesView, libraryBookData, linkBuilder, thumbnailWidth, viewType } = props;

  const dispatch = useDispatch();
  const platformBookData = useSelector(state => bookSelectors.getBook(state, bookId));
  const unitData = useSelector(state => bookSelectors.getUnit(state, libraryBookData.unit_id));
  const isSelected = useSelector(state => selectionSelectors.getIsItemSelected(state, bookId));
  const isVerifiedAdult = useSelector(getAdultVerification);
  const showUpdateBadge = useSelector(state => {
    if (!(platformBookData && platformBookData.series)) {
      return false;
    }

    if (isSeriesView) {
      return isAfter(platformBookData.publish.ridibooks_publish, subDays(new Date(), 3));
    }

    return getIsRecentlyUpdated(state, platformBookData.series.property.opened_last_volume_id);
  });

  const handleSelectedChange = React.useCallback(() => dispatch(toggleItem(bookId)), [bookId]);

  if (!libraryBookData || !platformBookData) {
    return viewType === ViewType.PORTRAIT ? (
      <div key={bookId} className={className} css={styles.portrait}>
        <PortraitBook />
      </div>
    ) : (
      <div key={bookId} className={className} css={styles.landscape}>
        <LandscapeBook />
      </div>
    );
  }
  if (platformBookData.isDeleted) return null;

  const { isPurchasedBook, libraryBookProps, thumbnailLink } = refineBookData({
    libraryBookData,
    platformBookData,
    unit: unitData,
    isSelectMode,
    isSelected,
    onSelectedChange: handleSelectedChange,
    viewType,
    linkBuilder,
    showUpdateBadge,
    thumbnailWidth,
    isVerifiedAdult,
  });

  return viewType === ViewType.PORTRAIT ? (
    <div className={className} css={styles.portrait}>
      <Book.PortraitBook {...libraryBookProps} />
    </div>
  ) : (
    <div className={className} css={styles.landscape}>
      <Book.LandscapeBook {...libraryBookProps} />
      {isSelectMode && !isPurchasedBook && <Disabled />}
      {!isSelectMode && thumbnailLink && <FullButton>{thumbnailLink}</FullButton>}
    </div>
  );
};

export default BookItem;

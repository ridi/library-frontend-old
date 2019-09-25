/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import isAfter from 'date-fns/is_after';
import subDays from 'date-fns/sub_days';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as featureIds from '../../constants/featureIds';
import { UnitType } from '../../constants/unitType';
import ViewType from '../../constants/viewType';
import { getAdultVerification } from '../../services/account/selectors';
import { showShelfBookAlertToast } from '../../services/book/actions';
import * as bookSelectors from '../../services/book/selectors';
import * as featureSelectors from '../../services/feature/selectors';
import { getIsRecentlyUpdated } from '../../services/purchased/common/selectors';
import { toggleItem } from '../../services/selection/actions';
import * as selectionSelectors from '../../services/selection/selectors';
import adultCover from '../../static/cover/adult.png';
import * as styles from '../../styles/books';
import { getResponsiveBookSizeForBookList } from '../../styles/responsive';
import BookMetaData from '../../utils/bookMetaData';
import BooksWrapper from '../BooksWrapper';
import LandscapeBook from '../Skeleton/SkeletonBooks/LandscapeBook';
import PortraitBook from '../Skeleton/SkeletonBooks/PortraitBook';
import { Disabled } from './Disabled';
import EmptyLandscapeBook from './EmptyLandscapeBook';
import FullButton from './FullButton';
import { ShelfBookAlertButton } from './ShelfBookAlertButton';

const refineBookData = ({
  libraryBookData,
  platformBookData,
  unitData,
  isSelectMode,
  isSelected,
  onSelectedChange,
  viewType,
  linkBuilder,
  isSyncShelfEnabled,
  showUpdateBadge,
  thumbnailWidth,
  isVerifiedAdult,
}) => {
  const {
    unit_count: bookCount,
    remain_time: expiredAt,
    expire_date: expireDate,
    is_ridiselect: isRidiselect,
    unit_type: unitType,
    unit_title: unitTitle,
    purchase_date: purchaseDate,
  } = libraryBookData;
  const bookMetaData = new BookMetaData(platformBookData);

  const bookCountUnit = platformBookData.series?.property?.unit || Book.BookCountUnit.Single;
  const isAdultOnly = platformBookData.property.is_adult_only;
  const isExpired = !isRidiselect && expireDate && isAfter(new Date(), expireDate);
  const isNotAvailable = expireDate ? isAfter(new Date(), expireDate) : false;
  const isPurchasedBook = !!purchaseDate;
  const isCollectionBook = unitType && UnitType.isCollection(unitType);
  const isUnitBook = unitType && !UnitType.isBook(unitType);
  const unit = unitData;

  const isRidiselectSingleUnit = isRidiselect && isUnitBook && bookCount === 1;

  const thumbnailLink = linkBuilder ? linkBuilder(libraryBookData, platformBookData) : null;

  const unitBookCount = bookCount && <Book.UnitBookCount bookCount={bookCount} bookCountUnit={bookCountUnit} />;
  const title = unit ? unit.title : unitTitle || platformBookData.title.main;

  const thumbnailUrl = isAdultOnly && !isVerifiedAdult ? adultCover : `${platformBookData.thumbnail.large}?dpi=xhdpi`;

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    updateBadge: showUpdateBadge,
    ridiselect: isRidiselect,
    selectMode: isSelectMode && isPurchasedBook && !(isSyncShelfEnabled && isCollectionBook),
    selected: isSelected,
    unitBook: isUnitBook && !isRidiselectSingleUnit,
    unitBookCount,
    onSelectedChange,
    thumbnailLink,
  };

  const portraitBookProps = {
    thumbnailWidth,
    expiredAt,
  };
  const landscapeBookProps = {
    title,
    author: bookMetaData.authorSimple,
    thumbnailWidth: 60,
    expiredAt,
  };

  return {
    isPurchasedBook,
    isCollectionBook,
    libraryBookProps: {
      ...defaultBookProps,
      ...(viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps),
    },
    thumbnailLink,
  };
};

function BookItem(props) {
  const { bookId, className, isSelectMode, isSeriesView, libraryBookData, linkBuilder, thumbnailWidth, viewType } = props;

  const dispatch = useDispatch();
  const handleShelfBookAlert = React.useCallback(() => dispatch(showShelfBookAlertToast()), []);
  const platformBookData = useSelector(state => bookSelectors.getBook(state, bookId));
  const unitData = useSelector(state => bookSelectors.getUnit(state, libraryBookData.unit_id));
  const isSelected = useSelector(state => selectionSelectors.getIsItemSelected(state, bookId));
  const isVerifiedAdult = useSelector(getAdultVerification);
  const isSyncShelfEnabled = useSelector(state => featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF));
  const showUpdateBadge = useSelector(state => {
    if (!platformBookData.series) {
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

  const { isPurchasedBook, isCollectionBook, libraryBookProps, thumbnailLink } = refineBookData({
    libraryBookData,
    platformBookData,
    unit: unitData,
    isSelectMode,
    isSelected,
    onSelectedChange: handleSelectedChange,
    viewType,
    linkBuilder,
    isSyncShelfEnabled,
    showUpdateBadge,
    thumbnailWidth,
    isVerifiedAdult,
  });

  return viewType === ViewType.PORTRAIT ? (
    <div className={className} css={styles.portrait}>
      <Book.PortraitBook {...libraryBookProps} />
      {isSyncShelfEnabled && isSelectMode && isCollectionBook && <ShelfBookAlertButton onClickShelfBook={handleShelfBookAlert} />}
    </div>
  ) : (
    <div className={className} css={styles.landscape}>
      <Book.LandscapeBook {...libraryBookProps} />
      {isSelectMode && !isPurchasedBook && <Disabled />}
      {!isSelectMode && thumbnailLink && <FullButton>{thumbnailLink}</FullButton>}
      {isSyncShelfEnabled && isSelectMode && isCollectionBook && <ShelfBookAlertButton onClickShelfBook={handleShelfBookAlert} />}
    </div>
  );
}

export function Books(props) {
  const { bookIds, isSelectMode, isSeriesView, libraryBookDTO, linkBuilder, viewType: givenViewType } = props;

  const viewType = useSelector(state => givenViewType || state.ui.viewType);
  const isLoaded = true;
  const [thumbnailWidth, setThumbnailWidth] = useState(100);
  const setResponsiveThumbnailWidth = () => {
    setThumbnailWidth(getResponsiveBookSizeForBookList(window.innerWidth).width);
  };
  useEffect(
    () => {
      setResponsiveThumbnailWidth();
      window.addEventListener('resize', setResponsiveThumbnailWidth);
      return () => {
        window.removeEventListener('resize', setResponsiveThumbnailWidth);
      };
    },
    [isLoaded],
  );

  // TODO: compat
  let finalBookIds = [];
  let libraryBookMap = new Map();
  if (libraryBookDTO != null) {
    finalBookIds = libraryBookDTO.map(book => book.b_id);
    libraryBookMap = new Map(libraryBookDTO.map(book => [book.b_id, book]));
  }
  if (finalBookIds.length === 0) {
    finalBookIds = bookIds;
  }
  return (
    <BooksWrapper
      viewType={viewType}
      books={finalBookIds}
      renderBook={({ book: bookId, className }) => (
        <BookItem
          key={bookId}
          bookId={bookId}
          className={className}
          isSelectMode={isSelectMode}
          isSeriesView={isSeriesView}
          libraryBookData={libraryBookMap.get(bookId)}
          linkBuilder={linkBuilder}
          thumbnailWidth={thumbnailWidth}
          viewType={viewType}
        />
      )}
    >
      {({ books }) => {
        const libraryBooksCount = finalBookIds.length;
        const isNeedLandscapeBookSeparator = viewType === ViewType.LANDSCAPE && libraryBooksCount % 2 !== 0;

        return (
          <React.Fragment>
            {books}
            {isNeedLandscapeBookSeparator && <EmptyLandscapeBook />}
          </React.Fragment>
        );
      }}
    </BooksWrapper>
  );
}

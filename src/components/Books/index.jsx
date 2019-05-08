/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter, subDays } from 'date-fns';
import { merge } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as featureIds from '../../constants/featureIds';
import { UnitType } from '../../constants/unitType';
import ViewType from '../../constants/viewType';
import { showShelfBookAlertToast } from '../../services/book/actions';
import { getBooks } from '../../services/book/selectors';
import * as featureSelectors from '../../services/feature/selectors';
import { toggleItem } from '../../services/selection/actions';
import { getSelectedItems } from '../../services/selection/selectors';
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
  units,
  isSelectMode,
  isSelected,
  onSelectedChange,
  viewType,
  linkBuilder,
  isSeriesView,
  isSyncShelfEnabled,
  recentlyUpdatedMap,
  thumbnailWidth,
}) => {
  const {
    unit_count: bookCount,
    remain_time: expiredAt,
    expire_date: expireDate,
    is_ridiselect: isRidiselect,
    unit_type: unitType,
    unit_title: unitTitle,
    b_id: bookId,
    purchase_date: purchaseDate,
    unit_id: unitId,
  } = libraryBookData;
  const bookMetaData = new BookMetaData(platformBookData);

  const bookCountUnit = platformBookData.series?.property?.unit || Book.BookCountUnit.Single;
  const isAdultOnly = platformBookData.property.is_adult_only;
  const isExpired = !isRidiselect && expireDate && isAfter(new Date(), expireDate);
  const isNotAvailable = expireDate ? isAfter(new Date(), expireDate) : false;
  const isPurchasedBook = !!purchaseDate;
  const isCollectionBook = unitType && UnitType.isCollection(unitType);
  const isUnitBook = unitType && !UnitType.isBook(unitType);
  const unit = units && units[unitId] ? units[unitId] : null;

  const isRidiselectSingleUnit = isRidiselect && isUnitBook && bookCount === 1;
  let updateBadge = false;
  if (platformBookData.series) {
    if (isSeriesView) {
      updateBadge = isAfter(platformBookData.publish.ridibooks_publish, subDays(new Date(), 3));
    } else {
      updateBadge = recentlyUpdatedMap ? recentlyUpdatedMap[platformBookData.series.property.opened_last_volume_id] : false;
    }
  }

  const thumbnailLink = linkBuilder ? linkBuilder(libraryBookData, platformBookData) : null;

  const unitBookCount = bookCount && <Book.UnitBookCount bookCount={bookCount} bookCountUnit={bookCountUnit} />;
  const title = unit ? unit.title : unitTitle || platformBookData.title.main;

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl: `${platformBookData.thumbnail.large}?dpi=xhdpi`,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    updateBadge,
    ridiselect: isRidiselect,
    selectMode: isSelectMode && isPurchasedBook && !(isSyncShelfEnabled && isCollectionBook),
    selected: isSelected,
    unitBook: isUnitBook && !isRidiselectSingleUnit,
    unitBookCount,
    onSelectedChange: () => onSelectedChange(bookId),
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
    libraryBookProps: merge(defaultBookProps, viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps),
    thumbnailLink,
  };
};

const mapStateToPropsFactory = () => {
  const selectBookIds = createSelector(
    props => props.libraryBookDTO,
    items => items.map(x => x.b_id),
  );
  return (state, props) => {
    const bookIds = selectBookIds(props);
    return {
      isSyncShelfEnabled: featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF),
      selectedBooks: getSelectedItems(state),
      platformBookDTO: getBooks(state, bookIds),
    };
  };
};

const mapDispatchToProps = {
  onSelectedChange: toggleItem,
  dispatchShowShelfBookAlertToast: showShelfBookAlertToast,
};

export const Books = connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(props => {
  const isLoaded = true;
  const {
    libraryBookDTO,
    bookIds,
    platformBookDTO,
    units,
    selectedBooks,
    isSelectMode,
    onSelectedChange,
    viewType,
    linkBuilder,
    isSeriesView,
    isSyncShelfEnabled,
    recentlyUpdatedMap,
    dispatchShowShelfBookAlertToast,
  } = props;
  const [thumbnailWidth, setThumbnailWidth] = useState('100%');
  const setResponsiveThumbnailWidth = () => {
    setThumbnailWidth(getResponsiveBookSizeForBookList(window.innerWidth).width);
  };
  const handleShelfBookAlert = () => {
    dispatchShowShelfBookAlertToast();
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
      renderBook={({ book: bookId, className }) => {
        const libraryBookData = libraryBookMap.get(bookId);
        const platformBookData = platformBookDTO[bookId];
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

        const isSelected = !!selectedBooks[bookId];
        const { isPurchasedBook, isCollectionBook, libraryBookProps, thumbnailLink } = refineBookData({
          libraryBookData,
          platformBookData,
          units,
          isSelectMode,
          isSelected,
          onSelectedChange,
          viewType,
          linkBuilder,
          isSeriesView,
          isSyncShelfEnabled,
          recentlyUpdatedMap,
          thumbnailWidth,
        });

        return viewType === ViewType.PORTRAIT ? (
          <div key={bookId} className={className} css={styles.portrait}>
            <Book.PortraitBook {...libraryBookProps} />
            {isSyncShelfEnabled && isSelectMode && isCollectionBook && <ShelfBookAlertButton onClickShelfBook={handleShelfBookAlert} />}
          </div>
        ) : (
          <div key={bookId} className={className} css={styles.landscape}>
            <Book.LandscapeBook {...libraryBookProps} />
            {isSelectMode && !isPurchasedBook && <Disabled />}
            {!isSelectMode && thumbnailLink && <FullButton>{thumbnailLink}</FullButton>}
            {isSyncShelfEnabled && isSelectMode && isCollectionBook && <ShelfBookAlertButton onClickShelfBook={handleShelfBookAlert} />}
          </div>
        );
      }}
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
});

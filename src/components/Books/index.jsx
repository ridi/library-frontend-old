/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter, subDays } from 'date-fns';
import { merge } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { UnitType } from '../../constants/unitType';
import ViewType from '../../constants/viewType';
import * as styles from '../../styles/books';
import BookMetaData from '../../utils/bookMetaData';
import BooksWrapper from '../BooksWrapper';
import EmptyLandscapeBook from './EmptyLandscapeBook';
import LandscapeFullButton from './LandscapeFullButton';
import { getResponsiveBookSizeForBookList } from '../../styles/responsive';
import LandscapeBook from '../Skeleton/SkeletonBooks/LandscapeBook';
import PortraitBook from '../Skeleton/SkeletonBooks/PortraitBook';
import { Disabled } from './Disabled';

import { toggleBook } from '../../services/selection/actions';
import { getSelectedBooks } from '../../services/selection/selectors';

const toProps = ({
  bookId,
  libraryBookData,
  platformBookData,
  unit,
  isSelectMode,
  isSelected,
  onSelectedChange,
  viewType,
  linkBuilder,
  isSeriesView,
  recentlyUpdatedMap,
  thumbnailWidth,
  isPurchasedBook,
}) => {
  const bookMetaData = new BookMetaData(platformBookData);
  const isAdultOnly = platformBookData.property.is_adult_only;
  const isRidiselect = libraryBookData.is_ridiselect;
  const isExpired = !isRidiselect && libraryBookData.expire_date && isAfter(new Date(), libraryBookData.expire_date);
  const expiredAt = libraryBookData.remain_time;
  const isUnitBook = libraryBookData.unit_type && !UnitType.isBook(libraryBookData.unit_type);
  const bookCount = libraryBookData.unit_count;
  const bookCountUnit = platformBookData.series?.property?.unit || Book.BookCountUnit.Single;
  const isNotAvailable = libraryBookData.expire_date ? isAfter(new Date(), libraryBookData.expire_date) : false;
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
  const title = unit ? unit.title : libraryBookData.unit_title || platformBookData.title.main;

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl: `${platformBookData.thumbnail.large}?dpi=xhdpi`,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    updateBadge,
    ridiselect: isRidiselect,
    selectMode: isSelectMode && isPurchasedBook,
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

  return merge(defaultBookProps, viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps);
};

const mapStateToProps = state => ({
  selectedBooks: getSelectedBooks(state),
});

const mapDispatchToProps = {
  onSelectedChange: toggleBook,
};

export const Books = connect(
  mapStateToProps,
  mapDispatchToProps,
)(props => {
  const isLoaded = true;
  const {
    libraryBookDTO,
    platformBookDTO,
    units,
    selectedBooks,
    isSelectMode,
    onSelectedChange,
    viewType,
    linkBuilder,
    isSeriesView,
    recentlyUpdatedMap,
  } = props;
  const [thumbnailWidth, setThumbnailWidth] = useState('100%');
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

  return (
    <BooksWrapper
      viewType={viewType}
      books={libraryBookDTO}
      renderBook={({ book: libraryBookData, className }) => {
        const bookId = libraryBookData.b_id;
        const platformBookData = platformBookDTO[bookId];
        if (!platformBookData) {
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
<<<<<<< HEAD
        const isPurchasedBook = !!libraryBookData.purchase_date;
        const unit = units && units[libraryBookData.unit_id] ? units[libraryBookData.unit_id] : null;
=======
        if (platformBookData.isDeleted) return null;
>>>>>>> e0438cdf... book-api의 is_deleted 대응

        const isSelected = !!selectedBooks[bookId];
        const libraryBookProps = toProps({
          bookId,
          libraryBookData,
          platformBookData,
          unit,
          isSelectMode,
          isSelected,
          onSelectedChange,
          viewType,
          linkBuilder,
          isSeriesView,
          recentlyUpdatedMap,
          thumbnailWidth,
          isPurchasedBook,
        });
        const { thumbnailLink } = libraryBookProps;

        return viewType === ViewType.PORTRAIT ? (
          <div key={bookId} className={className} css={styles.portrait}>
            <Book.PortraitBook {...libraryBookProps} />
          </div>
        ) : (
          <div key={bookId} className={className} css={styles.landscape}>
            <Book.LandscapeBook {...libraryBookProps} />
            {isSelectMode && !isPurchasedBook && <Disabled />}
            {!isSelectMode && thumbnailLink && <LandscapeFullButton thumbnailLink={thumbnailLink} />}
          </div>
        );
      }}
    >
      {({ books }) => {
        const libraryBooksCount = libraryBookDTO.length;
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

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter } from 'date-fns';
import { merge } from 'lodash';
import React from 'react';
import { UnitType } from '../../constants/unitType';
import ViewType from '../../constants/viewType';
import * as styles from '../../styles/books';
import BookMetaData from '../../utils/bookMetaData';
import BooksWrapper from '../BooksWrapper';
import EmptyLandscapeBook from './EmptyLandscapeBook';
import LandscapeFullButton from './LandscapeFullButton';
import LandscapeBook from '../Skeleton/SkeletonBooks/LandscapeBook';
import PortraitBook from '../Skeleton/SkeletonBooks/PortraitBook';

const toProps = ({
  bookId,
  libraryBookData,
  platformBookData,
  isSelectMode,
  isSelected,
  onSelectedChange,
  viewType,
  linkBuilder,
  recentlyUpdatedMap,
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
  const updateBadge =
    platformBookData.series && recentlyUpdatedMap ? recentlyUpdatedMap[platformBookData.series.property.last_volume_id] : false;

  const thumbnailLink = linkBuilder ? linkBuilder(libraryBookData, platformBookData) : null;

  const unitBookCount = bookCount > 1 && <Book.UnitBookCount bookCount={bookCount} bookCountUnit={bookCountUnit} />;
  const title = libraryBookData.unit_title || platformBookData.title.main;

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl: `${platformBookData.thumbnail.large}?dpi=xhdpi`,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    updateBadge,
    ridiselect: isRidiselect,
    selectMode: isSelectMode && libraryBookData.purchase_date,
    selected: isSelected,
    unitBook: isUnitBook,
    unitBookCount,
    onSelectedChange: () => onSelectedChange(bookId),
    thumbnailLink,
  };
  const portraitBookProps = {
    thumbnailWidth: '100%',
    expiredAt: expiredAt.replace(/\s남음/g, ''),
  };
  const landscapeBookProps = {
    title,
    author: bookMetaData.authorSimple,
    thumbnailWidth: 60,
    expiredAt,
  };

  return merge(defaultBookProps, viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps);
};

export const Books = ({
  libraryBookDTO,
  platformBookDTO,
  selectedBooks,
  isSelectMode,
  onSelectedChange,
  viewType,
  linkBuilder,
  recentlyUpdatedMap,
}) => (
  <BooksWrapper
    viewType={viewType}
    renderBooks={({ className }) => {
      const libraryBooks = libraryBookDTO.map(libraryBookData => {
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

        const isSelected = !!selectedBooks[bookId];
        const libraryBookProps = toProps({
          bookId,
          libraryBookData,
          platformBookData,
          isSelectMode,
          isSelected,
          onSelectedChange,
          viewType,
          linkBuilder,
          recentlyUpdatedMap,
        });
        const { thumbnailLink } = libraryBookProps;

        return viewType === ViewType.PORTRAIT ? (
          <div key={bookId} className={className} css={styles.portrait}>
            <Book.PortraitBook {...libraryBookProps} />
          </div>
        ) : (
          <div key={bookId} className={className} css={styles.landscape}>
            <Book.LandscapeBook {...libraryBookProps} />
            {!isSelectMode && thumbnailLink && <LandscapeFullButton thumbnailLink={thumbnailLink} />}
          </div>
        );
      });
      const libraryBooksCount = libraryBookDTO.length;
      const isNeedLandscapeBookSeparator =
        viewType === ViewType.LANDSCAPE && libraryBooks && libraryBooksCount !== 0 && libraryBooksCount % 2 !== 0;

      return (
        <React.Fragment>
          {libraryBooks}
          {isNeedLandscapeBookSeparator && <EmptyLandscapeBook />}
        </React.Fragment>
      );
    }}
  />
);

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter } from 'date-fns';
import { merge } from 'lodash';
import { UnitType } from '../../constants/unitType';
import ViewType from '../../constants/viewType';
import * as styles from '../../styles/books';
import BookMetaData from '../../utils/bookMetaData';
import BooksWrapper from '../BooksWrapper';
import LandscapeFullButton from './LandscapeFullButton';

const toProps = ({ bookId, libraryBookData, platformBookData, isSelectMode, isSelected, onSelectedChange, viewType, linkBuilder }) => {
  const bookMetaData = new BookMetaData(platformBookData);
  const isAdultOnly = platformBookData.property.is_adult_only;
  const isRidiselect = libraryBookData.is_ridiselect;
  const isExpired = !isRidiselect && isAfter(new Date(), libraryBookData.expire_date);
  const expiredAt = libraryBookData.remain_time;
  const isUnitBook = libraryBookData.unit_type && !UnitType.isBook(libraryBookData.unit_type);
  const bookCount = libraryBookData.unit_count;
  const bookCountUnit = platformBookData.series?.property?.unit || Book.BookCountUnit.Single;
  const isNotAvailable = isAfter(new Date(), libraryBookData.expire_date);

  const thumbnailLink = linkBuilder ? linkBuilder(libraryBookData, platformBookData) : null;

  const unitBookCount = bookCount > 1 && <Book.UnitBookCount bookCount={bookCount} bookCountUnit={bookCountUnit} />;
  const title = libraryBookData.unit_title || platformBookData.title.main;

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl: `${platformBookData.thumbnail.large}?dpi=xhdpi`,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    ridiselect: isRidiselect,
    selectMode: isSelectMode,
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

export const Books = ({ libraryBookDTO, platformBookDTO, selectedBooks, isSelectMode, onSelectedChange, viewType, linkBuilder }) => (
  <BooksWrapper
    viewType={viewType}
    renderBooks={({ className }) =>
      libraryBookDTO.map(libraryBookData => {
        const bookId = libraryBookData.b_id;
        const platformBookData = platformBookDTO[bookId];
        if (!platformBookData) {
          return null;
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
      })
    }
  />
);

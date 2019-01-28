/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter } from 'date-fns';
import { merge } from 'lodash';
import Link from 'next/link';
import { UnitType } from '../../constants/unitType';
import ViewType from '../../constants/viewType';
import * as styles from './styles';
import BookMetaData from '../../utils/bookMetaData';

const toProps = ({ bookId, libraryBookData, platformBookData, isSelectMode, isSelected, onSelectedChange, viewType, linkPropsBuilder }) => {
  const bookMetaData = new BookMetaData(platformBookData);
  const isAdultOnly = platformBookData.property.is_adult_only;
  const isRidiselect = libraryBookData.is_ridiselect;
  const isExpired = !isRidiselect && isAfter(new Date(), libraryBookData.expire_date);
  const isUnitBook = !UnitType.isBook(libraryBookData.unit_type);
  const bookCount = libraryBookData.unit_count;
  const bookCountUnit = platformBookData.series?.property?.unit || Book.BookCountUnit.Single;
  const isNotAvailable = !isUnitBook && isAfter(new Date(), libraryBookData.expire_date);
  const linkProps = linkPropsBuilder ? linkPropsBuilder(libraryBookData.unit_id) : null;
  const thumbnailLink = linkProps ? (
    <>
      <Link {...linkProps}>
        <a>더보기</a>
      </Link>
    </>
  ) : null;
  const unitBookCount = <Book.UnitBookCount bookCount={bookCount} bookCountUnit={bookCountUnit} />;
  const title = libraryBookData.unit_title || platformBookData.title.main;

  const defaultBookProps = {
    thumbnailUrl: platformBookData.thumbnail.large,
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
  };
  const landscapeBookProps = {
    title,
    author: bookMetaData.authorSimple,
    thumbnailWidth: 60,
  };

  return merge(defaultBookProps, viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps);
};

const renderLandscapeFullButton = libraryBookProps =>
  libraryBookProps ? <div css={styles.landscapeFullButton}>{libraryBookProps.thumbnailLink}</div> : null;

export class LibraryBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      additionalPadding: 0, // additional padding for horizontal align center
    };
  }

  componentDidMount() {
    this.setBooksAdditionalPadding();
    window.addEventListener('resize', this.setBooksAdditionalPadding);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setBooksAdditionalPadding);
  }

  setBooksAdditionalPadding = () => {
    const books = document.querySelector('.books');
    const book = document.querySelector('.book');
    const additionalPadding = Math.floor((books.offsetWidth % book.offsetWidth) / 2);
    this.setState({ additionalPadding });
  };

  render() {
    const { libraryBookDTO, platformBookDTO, selectedBooks, isSelectMode, onSelectedChange, viewType, linkPropsBuilder } = this.props;
    const { additionalPadding } = this.state;

    return (
      <div className="books" css={styles.books(viewType, additionalPadding)}>
        {libraryBookDTO.map(libraryBookData => {
          const bookId = libraryBookData.b_id;
          const platformBookData = platformBookDTO[bookId];
          const isSelected = !!selectedBooks[bookId];
          const libraryBookProps = toProps({
            bookId,
            libraryBookData,
            platformBookData,
            isSelectMode,
            isSelected,
            onSelectedChange,
            viewType,
            linkPropsBuilder,
          });
          return viewType === ViewType.PORTRAIT ? (
            <div key={bookId} className="book" css={styles.portrait}>
              <Book.PortraitBook {...libraryBookProps} />
            </div>
          ) : (
            <div key={bookId} className="book" css={styles.landscape}>
              <Book.LandscapeBook {...libraryBookProps} />
              {!isSelectMode && renderLandscapeFullButton(libraryBookProps)}
            </div>
          );
        })}
      </div>
    );
  }
}

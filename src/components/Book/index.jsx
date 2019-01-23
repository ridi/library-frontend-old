/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter } from 'date-fns';
import { merge } from 'lodash';
import Link from 'next/link';
import { URLMap } from '../../constants/urls';
import ViewType from '../../constants/viewType';
import { makeLinkProps } from '../../utils/uri';
import * as styles from './styles';

const toProps = ({ bookId, libraryBookData, platformBookData, isSelectMode, isSelected, onSelectedChange, viewType }) => {
  const isAdultOnly = platformBookData.property.is_adult_only;
  const isRidiselect = libraryBookData.is_ridiselect;
  const isExpired = !isRidiselect && isAfter(new Date(), libraryBookData.expire_date);
  const isUnitBook = libraryBookData.unit_type === 'series';
  const bookCount = libraryBookData.unit_count;
  const isNotAvailable = !isUnitBook && isAfter(new Date(), libraryBookData.expire_date);
  const linkProps = makeLinkProps(
    { pathname: URLMap.mainUnit.href, query: { unitId: libraryBookData.unit_id } },
    URLMap.mainUnit.as(libraryBookData.unit_id),
  );
  const thumbnailLink = (
    <>
      <Link {...linkProps}>
        <a>링크</a>
      </Link>
    </>
  );
  const unitBookCount = <Book.UnitBookCount bookCount={bookCount} bookCountUnit={Book.BookCountUnit.Single} />;
  const title = libraryBookData.unit_title ? libraryBookData.unit_title : platformBookData.title.main;
  const { author, story_writer: storyWriter } = platformBookData.authors;
  const authors = author || storyWriter;

  const defaultBookProps = {
    thumbnailUrl: `https://misc.ridibooks.com/cover/${libraryBookData.b_id}/xxlarge?dpi=xxhdpi`,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    ridiselect: isRidiselect,
    selectMode: isSelectMode,
    selected: isSelected,
    unitBook: libraryBookData.unit_type === 'series',
    unitBookCount,
    onSelectedChange: () => onSelectedChange(bookId),
    thumbnailLink,
  };
  const portraitBookProps = {
    thumbnailWidth: '100%',
  };
  const landscapeBookProps = {
    title,
    author: authors ? authors.map(authorData => authorData.name).join(', ') : '',
    thumbnailWidth: 60,
  };

  return merge(defaultBookProps, viewType === ViewType.LANDSCAPE ? landscapeBookProps : portraitBookProps);
};

export class LibraryBook extends React.Component {
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
    const { libraryBookDTO, platformBookDTO, selectedBooks, isSelectMode, onSelectedChange, viewType } = this.props;
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
          });
          return viewType === ViewType.PORTRAIT ? (
            <div className="book" css={styles.portrait}>
              <Book.PortraitBook {...libraryBookProps} />
            </div>
          ) : (
            <div className="book" css={styles.landscape}>
              <Book.LandscapeBook {...libraryBookProps} />
              {/* {libraryBookProps.thumbnailLink} */}
            </div>
          );
        })}
      </div>
    );
  }
}

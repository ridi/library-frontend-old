/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter } from 'date-fns';
import { merge } from 'lodash';
import Link from 'next/link';
import React from 'react';
import { URLMap } from '../../constants/urls';
import ViewType from '../../constants/viewType';
import { makeLinkProps } from '../../utils/uri';
import * as styles from './styles';

const libraryBookProps = ({ libraryBookData, platformBookData, isSelectMode, isSelected, onSelectedChange, viewType }) => {
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

  const bookProps = {
    thumbnailUrl: `https://misc.ridibooks.com/cover/${libraryBookData.b_id}/xxlarge?dpi=xxhdpi`,
    adultBadge: isAdultOnly,
    expired: isExpired,
    notAvailable: isNotAvailable,
    ridiselect: isRidiselect,
    selectMode: isSelectMode,
    selected: isSelected,
    unitBook: libraryBookData.unit_type === 'series',
    unitBookCount,
    onSelectedChange,
    thumbnailLink,
  };
  const landscapeBookProps = {
    title,
    author: authors ? authors.map(authorData => authorData.name).join(', ') : '',
    thumbnailWidth: 50,
  };
  if (viewType === ViewType.LANDSCAPE) merge(bookProps, landscapeBookProps);

  return bookProps;
};

export const LibraryBook = props => {
  const { viewType } = props;
  return viewType === ViewType.PORTRAIT ? (
    <div css={styles.portrait}>
      <Book.PortraitBook {...libraryBookProps(props)} />
    </div>
  ) : (
    <div css={styles.landscape}>
      <Book.LandscapeBook {...libraryBookProps(props)} />
    </div>
  );
};

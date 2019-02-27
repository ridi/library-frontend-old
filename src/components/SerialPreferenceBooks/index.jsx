/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import { Book } from '@ridi/web-ui/dist/index.node';
import { merge } from 'lodash';
import * as shortid from 'shortid';
import Genre from '../../constants/category';
import { getLocationHref } from '../../services/router/selectors';
import * as styles from '../../styles/books';
import BookMetaData from '../../utils/bookMetaData';
import { makeRidiStoreUri, makeWebViewerURI } from '../../utils/uri';
import LandscapeFullButton from './LandscapeFullButton';
import BooksWrapper from '../BooksWrapper';

const serialPreferenceStyles = {
  authorFieldSeparator: {
    display: 'inline-block',
    position: 'relative',
    width: 9,
    height: 16,
    verticalAlign: 'top',
    '::after': {
      content: `''`,
      display: 'block',
      width: 1,
      height: 9,
      background: '#d1d5d9',
      position: 'absolute',
      left: 4,
      top: 3,
    },
  },
  preferenceMeta: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: '1.3em',
    color: '#808991',
  },
  unreadDot: {
    display: 'inline-block',
    width: 4,
    height: 4,
    background: '#5abf0d',
    borderRadius: 4,
    verticalAlign: '12%',
    marginRight: 4,
  },
  seriesComplete: {
    background: '#b3b3b3',
    color: 'white',
    display: 'inline-block',
    padding: '0 3px 0 2px',
    fontSize: 9,
    height: 12,
    lineHeight: '12px',
    verticalAlign: '12%',
    borderRadius: 2,
    marginLeft: 4,
  },
  button: {
    display: 'block',
    width: 68,
    lineHeight: '30px',
    borderRadius: 4,
    border: '1px solod #0077d9',
    boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
    backgroundColor: '#1f8ce6',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    zIndex: 10,
  },
  buttonsWrapper: {
    '.LandscapeBook_Buttons': {
      zIndex: 10,
    },
  },
};

const toProps = ({
  bookSeriesId,
  platformBookData,
  recentReadPlatformBookData,
  recentReadBookId,
  isSelectMode,
  isSelected,
  onSelectedChange,
  locationHref,
}) => {
  const { property: seriesProperty } = platformBookData.series;
  const bookMetaData = new BookMetaData(platformBookData);
  const { title } = seriesProperty;

  const thumbnailLink = (
    <a href={makeRidiStoreUri(platformBookData.id)} target="_blank" rel="noopener noreferrer">
      리디북스에서 보기
    </a>
  );

  // 장르
  // 무조건 카테고리는 1개 이상 존재한다.
  const genre = Genre.convertToString(platformBookData.categories[0].genre);
  const authorAndGenre = (
    <>
      {genre}
      <span css={serialPreferenceStyles.authorFieldSeparator} key={shortid.generate()} />
      {bookMetaData.authorSimple}
    </>
  );

  // 시리즈 내 더 읽을 도서 여부
  const hasUnreadSeries = recentReadPlatformBookData.series.volume < seriesProperty.opened_book_count;
  // 완결 여부
  const isSerialCompleted = seriesProperty.is_serial_complete;
  // 성인도서 19금 뱃지
  const isAdultOnly = platformBookData.property.is_adult_only;

  const additionalMetadata = (
    <p css={serialPreferenceStyles.preferenceMeta}>
      {hasUnreadSeries && <span css={serialPreferenceStyles.unreadDot} key={shortid.generate()} />}
      <strong key={shortid.generate()}>{recentReadPlatformBookData.series.volume}화</strong> / 총 {seriesProperty.opened_book_count}화
      {isSerialCompleted && (
        <span css={serialPreferenceStyles.seriesComplete} key={shortid.generate()}>
          완결
        </span>
      )}
    </p>
  );

  const additionalButton = (
    <a
      href={makeWebViewerURI(recentReadBookId, locationHref)}
      target="_blank"
      rel="noopener noreferrer"
      css={serialPreferenceStyles.button}
    >
      {recentReadPlatformBookData.series.volume === 1 ? '첫화보기' : '이어보기'}
    </a>
  );

  const defaultBookProps = {
    thumbnailTitle: `${title} 표지`,
    thumbnailUrl: `${platformBookData.thumbnail.large}?dpi=xhdpi`,
    adultBadge: isAdultOnly,
    selectMode: isSelectMode,
    selected: isSelected,
    onSelectedChange: () => onSelectedChange(bookSeriesId),
    thumbnailLink,
  };

  const landscapeBookProps = {
    title,
    author: authorAndGenre,
    thumbnailWidth: 60,
    additionalMetadata,
    additionalButton,
  };

  return merge(defaultBookProps, landscapeBookProps);
};

class SerialPreferenceBooks extends React.Component {
  render() {
    const { items, platformBookDTO, selectedBooks, isSelectMode, onSelectedChange, viewType, locationHref } = this.props;

    return (
      <BooksWrapper
        viewType={viewType}
        renderBooks={({ className }) =>
          items.map(item => {
            const bookSeriesId = item.series_id;
            const recentReadPlatformBookData = platformBookDTO[item.recent_read_b_id];
            const platformBookData = platformBookDTO[bookSeriesId];
            const isSelected = !!selectedBooks[bookSeriesId];
            const recentReadBookId = item.recent_read_b_id;
            const libraryBookProps = toProps({
              bookSeriesId,
              platformBookData,
              recentReadPlatformBookData,
              recentReadBookId,
              isSelectMode,
              isSelected,
              onSelectedChange,
              viewType,
              locationHref,
            });
            const { thumbnailLink } = libraryBookProps;

            return (
              <div key={bookSeriesId} className={className} css={[styles.landscape, serialPreferenceStyles.buttonsWrapper]}>
                <Book.LandscapeBook {...libraryBookProps} />
                {!isSelectMode && thumbnailLink && <LandscapeFullButton thumbnailLink={thumbnailLink} />}
              </div>
            );
          })
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  locationHref: getLocationHref(state),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SerialPreferenceBooks);

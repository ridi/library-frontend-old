/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { connect } from 'react-redux';
import { Book } from '@ridi/web-ui/dist/index.node';
import { merge } from 'lodash';
import Genre from '../../constants/category';
import { getLocationHref } from '../../services/router/selectors';
import * as styles from '../../styles/books';
import BookMetaData from '../../utils/bookMetaData';
import { makeWebViewerURI, makeLinkProps } from '../../utils/uri';
import LandscapeFullButton from './LandscapeFullButton';
import BooksWrapper from '../BooksWrapper';
import SeriesCompleteIcon from '../../svgs/SeriesCompleteIcon.svg';
import { URLMap } from '../../constants/urls';
import { EmptySeries } from '../../utils/dataObject';
import { notifyMessage } from '../../utils/sentry';

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
    borderRadius: 2,
    marginLeft: 4,

    padding: '0px 2px 0 1px',
    boxSizing: 'border-box',
  },

  seriesCompleteIcon: {
    fill: 'white',
    width: 16,
    height: 8,
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
  unitId,
}) => {
  if (!platformBookData.series || !recentReadPlatformBookData.series) {
    notifyMessage(`[선호작품][${platformBookData.id}] 시리즈 정보가 존재하지 않습니다.`);
  }

  const { series = EmptySeries } = platformBookData;
  const { series: recentReadSeries = EmptySeries } = recentReadPlatformBookData;
  const bookMetaData = new BookMetaData(platformBookData);
  const { title = platformBookData.title.main } = series.property;

  const thumbnailLink = (
    <Link
      {...makeLinkProps(
        {
          pathname: URLMap.serialPreferenceUnit.href,
          query: { unitId },
        },
        URLMap.serialPreferenceUnit.as({ unitId }),
      )}
    >
      <a>시리즈뷰 가기</a>
    </Link>
  );

  // 장르
  // 무조건 카테고리는 1개 이상 존재한다.
  // BL 여부는 sub_genre 로 판단하며 BL 인 경우 만화, 소설 구분이 있는 경우 추가
  const { genre: mainGenre, sub_genre: subGenre, name: categoryName } = platformBookData.categories[0];
  const isBL = subGenre && subGenre === Genre.BL;
  const genre = Genre.convertToString(isBL ? subGenre : mainGenre);
  const authorAndGenre = (
    <>
      {genre}
      {isBL && categoryName ? ` ${categoryName}` : ''}
      <span css={serialPreferenceStyles.authorFieldSeparator} key={`${platformBookData.id}-a-f-s`} />
      {bookMetaData.authorSimple}
    </>
  );

  // 시리즈 내 더 읽을 도서 여부
  const hasUnreadSeries = recentReadSeries.volume < series.property.opened_book_count;
  // 완결 여부
  const isSerialCompleted = series.property.is_serial_complete;
  // 성인도서 19금 뱃지
  const isAdultOnly = platformBookData.property.is_adult_only;

  const additionalMetadata = (
    <p css={serialPreferenceStyles.preferenceMeta}>
      {hasUnreadSeries && <span css={serialPreferenceStyles.unreadDot} key={`${platformBookData.id}-s-p-u-d`} />}
      <strong key={`${platformBookData.id}-s-p-r-r-v`}>{recentReadSeries.volume}화</strong>
      {` / 총 ${series.property.opened_book_count}화`}
      {isSerialCompleted && (
        <span css={serialPreferenceStyles.seriesComplete} key={`${platformBookData.id}-s-p-s-c`}>
          <SeriesCompleteIcon css={serialPreferenceStyles.seriesCompleteIcon} />
        </span>
      )}
    </p>
  );

  const additionalButton = (
    <a href={makeWebViewerURI(recentReadBookId, locationHref)} css={serialPreferenceStyles.button}>
      {recentReadSeries.volume === 1 ? '첫화보기' : '이어보기'}
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
    const { items, toUnitIdMap, platformBookDTO, selectedBooks, isSelectMode, onSelectedChange, viewType, locationHref } = this.props;

    return (
      <BooksWrapper
        viewType={viewType}
        renderBooks={({ className }) =>
          items.map(item => {
            const bookSeriesId = item.series_id;
            const recentReadPlatformBookData = platformBookDTO[item.recent_read_b_id];
            const platformBookData = platformBookDTO[bookSeriesId];
            const isSelected = !!selectedBooks[bookSeriesId];
            const unitId = toUnitIdMap[bookSeriesId];
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
              unitId,
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

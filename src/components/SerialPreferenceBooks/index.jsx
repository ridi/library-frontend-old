/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import config from '../../config';
import Genre from '../../constants/category';
import { toggleItem } from '../../services/selection/actions';
import { getSelectedItems } from '../../services/selection/selectors';
import * as styles from '../../styles/books';
import SeriesCompleteIcon from '../../svgs/SeriesCompleteIcon.svg';
import BookMetaData from '../../utils/bookMetaData';
import { EmptySeries } from '../../utils/dataObject';
import { notifyMessage } from '../../utils/sentry';
import { makeWebViewerURI } from '../../utils/uri';
import BooksWrapper from '../BooksWrapper';
import FullButton from './FullButton';
import * as serialPreferenceStyles from './styles';

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
  if (!platformBookData.series || !recentReadPlatformBookData.series) {
    notifyMessage(`[선호 작품][${platformBookData.id}] 시리즈 정보가 존재하지 않습니다.`);
  }

  const { series = EmptySeries } = platformBookData;
  const { series: recentReadSeries = EmptySeries } = recentReadPlatformBookData;
  const bookMetaData = new BookMetaData(platformBookData);
  const { title = platformBookData.title.main } = series.property;
  const thumbnailLink = <a href={`${config.STORE_BASE_URL}/v2/Detail?id=${platformBookData.id}`}>서점 상세페이지로 이동</a>;

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

  return {
    ...defaultBookProps,
    ...landscapeBookProps,
  };
};

class SerialPreferenceBooks extends React.Component {
  render() {
    const { items, platformBookDTO, selectedBooks, isSelectMode, onSelectedChange, viewType, locationHref } = this.props;

    return (
      <BooksWrapper
        viewType={viewType}
        books={items}
        renderBook={({ book: item, className }) => {
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
              {!isSelectMode && thumbnailLink && <FullButton>{thumbnailLink}</FullButton>}
            </div>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const { pathname, search } = props.location;
  const locationHref = `${config.BASE_URL}${pathname}${search}`;
  return {
    locationHref,
    selectedBooks: getSelectedItems(state),
  };
};

const mapDispatchToProps = {
  onSelectedChange: toggleItem,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SerialPreferenceBooks),
);

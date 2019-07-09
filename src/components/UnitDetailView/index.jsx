/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter } from 'date-fns';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { UnitType } from '../../constants/unitType';
import { getAdultVerification } from '../../services/account/selectors';
import { getBook } from '../../services/book/selectors';
import { downloadBooks, downloadBooksByUnitIds } from '../../services/bookDownload/actions';
import { getFetchingReadLatest, getReadLatestData } from '../../services/purchased/common/selectors';
import { getLocationHref } from '../../services/router/selectors';
import adultCover from '../../static/cover/adult.png';
import { getResponsiveBookWidthForDetailHeader } from '../../styles/unitDetailViewHeader';
import NoneDashedArrowDown from '../../svgs/NoneDashedArrowDown.svg';
import NoneDashedArrowRight from '../../svgs/NoneDashedArrowRight.svg';
import Star from '../../svgs/Star.svg';
import BookMetaData from '../../utils/bookMetaData';
import { thousandsSeperator } from '../../utils/number';
import { makeRidiSelectUri, makeRidiStoreUri, makeWebViewerURI } from '../../utils/uri';
import SkeletonUnitDetailView from '../Skeleton/SkeletonUnitDetailView';
import * as styles from './styles';

const LINE_HEIGHT = 23;
const LINE = 6;

class UnitDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = null;

    this.state = {
      isExpanded: false,
      isTruncated: false,
      thumbnailWidth: 130,
    };
  }

  get isPurchased() {
    const { primaryItem } = this.props;
    return !!primaryItem;
  }

  setThumbnailWidth = () => {
    const newThumbnailWidth = getResponsiveBookWidthForDetailHeader(window.innerWidth);
    if (this.state.thumbnailWidth !== newThumbnailWidth) {
      this.setState({
        thumbnailWidth: newThumbnailWidth,
      });
    }
  };

  componentDidMount() {
    this.setThumbnailWidth();
    window.addEventListener('resize', this.setThumbnailWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setThumbnailWidth);
  }

  checkTruncated() {
    if (this.wrapper) {
      if (!this.state.isTruncated && this.wrapper.offsetHeight > (LINE - 1) * LINE_HEIGHT) {
        this.setState({ isTruncated: true });
      }
    }
  }

  renderSummary() {
    const { bookMetadata, bookStarRating } = this.props;
    const bookInfos = bookMetadata.infos;

    return (
      <p css={styles.fileInfo}>
        <Star css={styles.starRateIcon} />
        <strong css={styles.starRate}>{`${bookStarRating.buyer_rating_score}점 `}</strong>
        <span css={styles.fileInfoText}>({thousandsSeperator(bookStarRating.buyer_rating_count)}명)</span>
        <span key="s-d-star-rate" css={styles.fileInfoDelimiter} />
        {bookInfos.map((info, index) => (
          <React.Fragment key={`s-d-m-f-${info}`}>
            <span key={`s-d-m-s-${info}`} css={styles.fileInfoText}>
              {`${info}`}
            </span>
            {bookInfos.length !== index + 1 ? <span key={`s-d-m-d-${info}`} css={styles.fileInfoDelimiter} /> : null}
          </React.Fragment>
        ))}
      </p>
    );
  }

  toggleExpand = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  renderExpanderButton() {
    const { isExpanded, isTruncated } = this.state;

    return (
      <div css={styles.bookDescriptionExpend}>
        {isTruncated ? (
          <button type="button" onClick={() => this.toggleExpand()} css={styles.bookDescriptionExpendButton}>
            {isExpanded ? '접기' : '계속 읽기'}
            <NoneDashedArrowDown css={[styles.bookDescriptionExpendIcon, isExpanded && styles.bookDescriptionExpendIconExpanded]} />
          </button>
        ) : null}
      </div>
    );
  }

  renderDescription() {
    const { isExpanded } = this.state;
    const { bookDescription } = this.props;

    return (
      <div css={styles.description}>
        <div css={styles.descriptionTitle}>책 소개</div>
        <div css={[styles.bookDescriptionBody(LINE_HEIGHT), !isExpanded && styles.bookDescriptionFolded(LINE, LINE_HEIGHT)]}>
          <p
            css={styles.bookDescription}
            dangerouslySetInnerHTML={{ __html: bookDescription.intro.split('\n').join('<br />') }}
            ref={wrapper => {
              this.wrapper = wrapper;
              this.checkTruncated();
            }}
          />
        </div>
        {this.renderExpanderButton()}
      </div>
    );
  }

  renderReadLatestButton() {
    const { readableLatest, unit, book, readLatestBookData, locationHref, fetchingReadLatest } = this.props;

    if (!readableLatest) {
      return null;
    }

    if (!(UnitType.isSeries(unit.type) && book.support.web_viewer)) {
      // 시리즈면서 web_viewser 서포트일때만 이어보기 노출
      return null;
    }

    if (fetchingReadLatest || !readLatestBookData) {
      return (
        <button type="button" css={styles.readLatestButton}>
          <div css={styles.readLatestButtonSpinner} />
        </button>
      );
    }

    return (
      <a css={styles.readLatestButtonAnchor} href={makeWebViewerURI(readLatestBookData.bookId || book.series.id, locationHref)}>
        <button type="button" css={styles.readLatestButton}>
          {readLatestBookData.bookId ? '이어보기' : '첫화보기'}
        </button>
      </a>
    );
  }

  renderDownloadButton() {
    const { unit, book, primaryItem, items, downloadable, dispatchDownloadBooksByUnitIds } = this.props;

    if (!this.isPurchased) {
      return null;
    }

    if (!downloadable || isAfter(new Date(), primaryItem.expire_date)) {
      return null;
    }

    return (
      <button
        type="button"
        css={styles.downloadButton(UnitType.isSeries(unit.type) && book.support.web_viewer)}
        onClick={() => {
          dispatchDownloadBooksByUnitIds([unit.id]);
        }}
      >
        {items.length > 1 ? '전체 다운로드' : '다운로드'}
      </button>
    );
  }

  renderLink() {
    const { book, primaryItem } = this.props;
    const href = this.isPurchased && primaryItem.is_ridiselect ? makeRidiSelectUri(book.id) : makeRidiStoreUri(book.id);
    const serviceName = this.isPurchased && primaryItem.is_ridiselect ? '리디셀렉트' : '서점';
    return (
      <a css={styles.outerTextLink} href={href}>
        {serviceName}에서 보기
        <NoneDashedArrowRight css={styles.outerLinkIcon} />
      </a>
    );
  }

  renderAuthors() {
    const { unit, book } = this.props;
    const bookMetadata = new BookMetaData(book, unit);

    return (
      <div css={styles.authorList}>
        {bookMetadata.authors.map((author, index) => (
          <React.Fragment key={`a-f-${author}`}>
            <span key={`a-s-${author}`}>{` ${author} `}</span>
            {bookMetadata.authors.length !== index + 1 ? <span key={`a-s-delimiter-${author}`} css={styles.authorDelimiter} /> : null}
          </React.Fragment>
        ))}
      </div>
    );
  }

  render() {
    const { unit, items, primaryItem, book, bookDescription, bookStarRating, isVerifiedAdult } = this.props;
    const { thumbnailWidth } = this.state;

    if (!unit || !book || !bookDescription || !bookStarRating) {
      return (
        <div css={styles.unitDetailViewWrapper}>
          <SkeletonUnitDetailView />
        </div>
      );
    }

    const _notAvailable = this.isPurchased && items.length === 1 && isAfter(new Date(), primaryItem.expire_date);
    const isAdultOnly = book.property.is_adult_only;
    const thumbnailUrl = isAdultOnly && !isVerifiedAdult ? adultCover : `${book.thumbnail.xxlarge}?dpi=xhdpi`;

    return (
      <div css={styles.unitDetailViewWrapper}>
        <section css={styles.header}>
          <div css={styles.thumbnailWrapper}>
            <div css={styles.thumbnail}>
              <Book.Thumbnail
                expired={_notAvailable}
                notAvailable={_notAvailable}
                adultBadge={isAdultOnly}
                thumbnailUrl={thumbnailUrl}
                thumbnailWidth={thumbnailWidth}
                expiredAt={UnitType.isBook(unit.type) && this.isPurchased && primaryItem.remain_time}
              />
            </div>
            {this.renderLink()}
          </div>
          <div css={styles.infoWrapper}>
            <h2 css={styles.unitTitle}>{unit.title}</h2>
            {this.renderAuthors()}
            {this.renderSummary()}
            {this.renderReadLatestButton()}
            {this.renderDownloadButton()}
          </div>
        </section>

        {this.renderDescription()}
      </div>
    );
  }
}

const mapStateToPropsFactory = () => {
  const selectBookMetadata = createSelector(
    getBook,
    (state, primaryBookId, unit) => unit,
    (book, unit) => new BookMetaData(book, unit),
  );
  return (state, props) => ({
    locationHref: getLocationHref(state),
    readLatestBookData: props.unit ? getReadLatestData(state, props.unit.id) : null,
    fetchingReadLatest: getFetchingReadLatest(state),
    book: props.primaryBookId && getBook(state, props.primaryBookId),
    bookMetadata: props.primaryBookId && selectBookMetadata(state, props.primaryBookId, props.unit),
    isVerifiedAdult: getAdultVerification(state),
  });
};

const mapDispatchToProps = {
  dispatchDownloadBooks: downloadBooks,
  dispatchDownloadBooksByUnitIds: downloadBooksByUnitIds,
};

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(UnitDetailView);

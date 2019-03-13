/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import { isAfter } from 'date-fns';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import shortid from 'shortid';
import config from '../../config';
import { UnitType } from '../../constants/unitType';
import { downloadBooks, downloadBooksByUnitIds } from '../../services/bookDownload/actions';
import NoneDashedArrowDown from '../../svgs/NoneDashedArrowDown.svg';
import NoneDashedArrowRight from '../../svgs/NoneDashedArrowRight.svg';
import Star from '../../svgs/Star.svg';
import BookMetaData from '../../utils/bookMetaData';
import { thousandsSeperator } from '../../utils/number';
import { makeRidiSelectUri, makeRidiStoreUri, makeWebViewerURI } from '../../utils/uri';
import SkeletonUnitDetailView from '../Skeleton/SkeletonUnitDetailView';
import * as styles from './styles';

import { getLocationHref } from '../../services/router/selectors';
import { getReadLatestData, getFetchingReadLatest } from '../../services/purchased/common/selectors';

const LINE_HEIGHT = 23;
const LINE = 6;

class UnitDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = null;

    this.state = {
      isExpanded: false,
      isTruncated: false,
    };
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
        <span key={shortid.generate()} css={styles.fileInfoDelimiter} />
        {bookInfos.map((info, index) => (
          <React.Fragment key={shortid.generate()}>
            <span key={shortid.generate()} css={styles.fileInfoText}>
              {`${info}`}
            </span>
            {bookInfos.length !== index + 1 ? <span key={shortid.generate()} css={styles.fileInfoDelimiter} /> : null}
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
        <div
          css={[
            styles.bookDescriptionBody(LINE_HEIGHT),
            isExpanded ? styles.bookDescriptionExpended : styles.bookDescriptionFolded(LINE, LINE_HEIGHT),
          ]}
        >
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
      return;
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
      <a
        css={styles.readLatestButtonAnchor}
        href={makeWebViewerURI(readLatestBookData.bookId || book.series.id, locationHref)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button type="button" css={styles.readLatestButton}>
          {readLatestBookData.bookId ? '이어보기' : '첫화보기'}
        </button>
      </a>
    );
  }

  renderDownloadButton() {
    const { unit, book, primaryItem, items, downloadable, dispatchDownloadBooksByUnitIds } = this.props;

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

  renderDrmFreeDownloadButton() {
    const { book } = this.props;
    if (!book.file.is_drm_free) {
      return null;
    }

    return (
      <button
        type="button"
        css={styles.drmFreeDownloadButton}
        onClick={() => {
          window.location.href = `${config.STORE_API_BASE_URL}/api/user-books/${book.id}/raw-download`;
        }}
      >
        EPUB 파일 다운로드
      </button>
    );
  }

  renderLink() {
    const { book, primaryItem } = this.props;
    const href = primaryItem.is_ridiselect ? makeRidiSelectUri(book.id) : makeRidiStoreUri(book.id);
    const serviceName = primaryItem.is_ridiselect ? '리디셀렉트' : '리디북스';
    return (
      <a css={styles.outerTextLink} href={href} target="_blank" rel="noopener noreferrer">
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
          <React.Fragment key={shortid.generate()}>
            <span key={shortid.generate()}>{` ${author} `}</span>
            {bookMetadata.authors.length !== index + 1 ? <span key={shortid.generate()} css={styles.authorDelimiter} /> : null}
          </React.Fragment>
        ))}
      </div>
    );
  }

  render() {
    const { unit, items, primaryItem, book, bookDescription, bookStarRating, readLatestBookId } = this.props;

    if (!unit || !primaryItem || !book || !bookDescription || !bookStarRating) {
      return (
        <div css={styles.unitDetailViewWrapper}>
          <SkeletonUnitDetailView />
        </div>
      );
    }

    const _notAvailable = items.length === 1 && isAfter(new Date(), primaryItem.expire_date);
    return (
      <div css={styles.unitDetailViewWrapper}>
        <section css={styles.header}>
          <div css={styles.thumbnailWrapper}>
            <div css={styles.thumbnail}>
              <Book.Thumbnail
                expired={_notAvailable}
                notAvailable={_notAvailable}
                adultBadge={book.property.is_adult_only}
                thumbnailUrl={`${book.thumbnail.xxlarge}?dpi=xhdpi`}
                css={{ width: '100%' }}
              />
            </div>
            {this.renderLink()}
          </div>
          <div css={styles.infoWrapper}>
            <div css={styles.unitTitle}>{unit.title}</div>
            {this.renderAuthors()}
            {this.renderSummary()}
            {this.renderReadLatestButton()}
            {this.renderDownloadButton()}
            {UnitType.isBook(unit.type) ? this.renderDrmFreeDownloadButton() : null}
          </div>
        </section>

        {this.renderDescription()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  locationHref: getLocationHref(state),
  readLatestBookData: ownProps.unit ? getReadLatestData(state, ownProps.unit.id) : null,
  fetchingReadLatest: getFetchingReadLatest(state),
});

const mapDispatchToProps = {
  dispatchDownloadBooks: downloadBooks,
  dispatchDownloadBooksByUnitIds: downloadBooksByUnitIds,
};

const mergeProps = (state, actions, props) => {
  const book = props.primaryItem && props.books[props.primaryItem.b_id] ? props.books[props.primaryItem.b_id] : null;
  const bookMetadata =
    props.primaryItem && props.books[props.primaryItem.b_id] ? new BookMetaData(props.books[props.primaryItem.b_id], props.unit) : null;

  return {
    ...state,
    ...actions,
    ...props,
    book,
    bookMetadata,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(UnitDetailView);
